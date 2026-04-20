import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// -- Specific Error Handlers --
const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
    const match = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/) : null;
    const value = match ? match[0] : 'Unknown value';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleZodError = (err: ZodError) => {
    const errors = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    const message = `Validation Failed. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

// -- Response Handlers --

const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err: any, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // 1) Log error for backend developers
        logger.error(err);
        
        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    
    // Zod specific error handling
    if (err instanceof ZodError) {
        error = handleZodError(err);
    } else if (error.name === 'CastError') {
        error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
        error = handleDuplicateFieldsDB(error);
    } else if (error.name === 'ValidationError') {
        error = handleValidationErrorDB(error);
    } else if (error.name === 'JsonWebTokenError') {
        error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
        error = handleJWTExpiredError();
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else {
        sendErrorProd(error, res);
    }
};

export default errorMiddleware;
