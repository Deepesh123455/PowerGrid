import { LoginInput, UpdatePasswordInput } from '../validations/auth.validation.js';

export interface IAuthService {
    login(data: LoginInput): Promise<any>;
    updatePassword(userId: string, data: UpdatePasswordInput): Promise<boolean>;
    refreshAccess(refreshToken: string): Promise<string>;
}
