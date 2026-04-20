import { db } from '../db/index.js';
import { locations, Location } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { ILocationRepository } from '../interfaces/ILocationRepository.js';
import { BaseRepository } from './BaseRepository.js';

export class LocationRepository extends BaseRepository<Location> implements ILocationRepository {
  constructor() {
    super('locations');
  }

  async getLocationsByUserId(userId: string): Promise<Location[]> {
    return db.select().from(locations).where(eq(locations.userId, userId));
  }

  // Override delete logic since locations are string IDs
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(locations).where(eq(locations.locationId, id)).returning();
    return result.length > 0;
  }
}
