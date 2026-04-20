import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper for asynchronous functions to catch errors and pass them to next().
 * Eliminates the need for try/catch blocks in controllers.
 * 
 * @param {Function} fn 
 * @returns {Function}
 */
const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
