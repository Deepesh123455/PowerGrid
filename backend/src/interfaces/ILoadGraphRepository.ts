import { IRepository } from './IRepository.js';
import { LoadGraph } from '../db/schema.js';

export interface ILoadGraphRepository extends IRepository<LoadGraph> {
    findByLocationIdAndInterval(locationId: string, intervalType: string): Promise<LoadGraph[]>;
    findByLocationId(locationId: string): Promise<LoadGraph[]>;
}
