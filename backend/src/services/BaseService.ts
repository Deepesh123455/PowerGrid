import { IRepository } from '../interfaces/IRepository.js';

/**
 * BaseService class
 * Core business logic goes here. Services communicate with repositories.
 * 
 * @class BaseService
 */
export abstract class BaseService<T> {
    protected repository: IRepository<T>;

    constructor(repository: IRepository<T>) {
        this.repository = repository;
    }

    async getById(id: string): Promise<T | null> {
        return await this.repository.find(id);
    }

    async getAll(): Promise<T[]> {
        return await this.repository.findAll();
    }

    async createItem(data: Partial<T>): Promise<T> {
        return await this.repository.create(data);
    }

    async updateItem(id: string, data: Partial<T>): Promise<T | null> {
        return await this.repository.update(id, data);
    }

    async deleteItem(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }
}
