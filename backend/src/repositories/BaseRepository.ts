import { IRepository } from '../interfaces/IRepository.js';

/**
 * BaseRepository class
 * Provides a base implementation for data access logic.
 * 
 * @class BaseRepository
 * @extends IRepository
 */
export abstract class BaseRepository<T> implements IRepository<T> {
    protected model: any;

    constructor(model: any) {
        this.model = model;
    }

    async find(id: string): Promise<T | null> {
        // Implementation depends on DB (e.g., this.model.findById(id))
        return null; 
    }

    async findAll(): Promise<T[]> {
        return [];
    }

    async create(data: Partial<T>): Promise<T> {
        return {} as T;
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return null;
    }

    async delete(id: string): Promise<boolean> {
        return true;
    }
}
