import { ILocationService } from '../interfaces/ILocationService.js';
import { ILocationRepository } from '../interfaces/ILocationRepository.js';
import { Location } from '../db/schema.js';
import AppError from '../utils/AppError.js';

export class LocationService implements ILocationService {
  constructor(private locationRepository: ILocationRepository) { }

  async getLocationsByUserId(userId: string): Promise<Location[]> {
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }
    return this.locationRepository.getLocationsByUserId(userId);
  }

  async deleteLocation(locationId: string): Promise<boolean> {
    if (!locationId) {
      throw new AppError('Location ID is required', 400);
    }

    // Check if it exists
    const location = await this.locationRepository.find(locationId);
    if (!location) {
      throw new AppError('Location not found', 404);
    }

    const deleted = await this.locationRepository.delete(locationId);
    if (!deleted) {
      throw new AppError('Failed to delete location', 500);
    }

    return true;
  }
}
