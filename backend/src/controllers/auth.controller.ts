import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import { IAuthService } from '../interfaces/IAuthService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const userRepository = new UserRepository();
const authService: IAuthService = new AuthService(userRepository);

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.login(req.body);

    const { tokens, user } = result;

    // Send refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // Match 7 days
    });

    res.status(200).json({
        status: 'success',
        data: {
            user,
            accessToken: tokens.accessToken
        },
    });
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.userId;

    await authService.updatePassword(userId, req.body);

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully',
    });
});

export const refreshTokens = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        // If no token exists, the user is effectively logged out or session expired.
        // Returning 401 will prompt the frontend to force logout.
        return next(new AppError('Session expired. Please log in again', 401));
    }

    try {
        const newAccessToken = await authService.refreshAccess(refreshToken);

        res.status(200).json({
            status: 'success',
            accessToken: newAccessToken
        });
    } catch (error) {
        // Ensure browser cookie is cleared if token is totally invalid
        res.clearCookie('refreshToken');
        return next(new AppError('Session expired. Please log in again', 401));
    }
});
