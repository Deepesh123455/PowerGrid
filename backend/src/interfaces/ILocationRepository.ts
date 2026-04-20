import { IRepository } from './IRepository.js';
import { Location } from '../db/schema.js';

export interface ILocationRepository extends IRepository<Location> {
  getLocationsByUserId(userId: string): Promise<Location[]>;
}
