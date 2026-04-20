import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';
import { UserRepository } from '../repositories/user.repository.js';

const userRepository = new UserRepository();

interface JwtPayload {
    userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

        const currentUser = await userRepository.find(decoded.userId);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // Attach user to request
        (req as any).user = currentUser;
        next();
    } catch (error) {
        return next(new AppError('Invalid token or token has expired. Please log in again.', 401));
    }
};
