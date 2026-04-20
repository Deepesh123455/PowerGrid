import { IUserRepository } from '../interfaces/IUserRepository.js';
import { IAuthService } from '../interfaces/IAuthService.js';
import AppError from '../utils/AppError.js';
import { LoginInput, UpdatePasswordInput } from '../validations/auth.validation.js';
import { generateAndStoreTokens, refreshAccessToken } from '../utils/token.util.js';

export class AuthService implements IAuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async login(data: LoginInput) {
        const { phoneNumber } = data;

        const user = await this.userRepository.findByPhoneNumber(phoneNumber);

        if (!user) {
            throw new AppError('Invalid phone number or password', 401);
        }

        const tokens = await generateAndStoreTokens(user.userId);

        return {
            user: {
                userId: user.userId,
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
            },
            tokens,
        };
    }

    async updatePassword(userId: string, data: UpdatePasswordInput) {
        const { newPassword } = data;

        const user = await this.userRepository.find(userId);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Update with the new password directly
        await this.userRepository.update(userId, { passwordHash: newPassword });

        return true;
    }

    async refreshAccess(refreshToken: string) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (!newAccessToken) {
            throw new AppError('Invalid or expired refresh token', 401);
        }

        return newAccessToken;
    }
}


