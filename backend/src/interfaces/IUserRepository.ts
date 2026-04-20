import { IRepository } from './IRepository.js';
import { User } from '../db/schema.js';

export interface IUserRepository extends IRepository<User> {
    findByPhoneNumber(phoneNumber: string): Promise<User | null>;
}
