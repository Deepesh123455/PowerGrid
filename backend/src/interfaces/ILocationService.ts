import { Location } from '../db/schema.js';

export interface ILocationService {
  getLocationsByUserId(userId: string): Promise<Location[]>;
  deleteLocation(locationId: string): Promise<boolean>;
}
