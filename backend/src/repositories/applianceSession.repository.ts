import { BaseRepository } from './BaseRepository.js'
import { db } from '../db/index.js';
import { applianceSessions, ApplianceSession } from '../db/schema.js';
import { IApplianceSessionRepository } from '../interfaces/IApplianceSessionRepository.js';
import { eq, and } from 'drizzle-orm';

export class ApplianceSessionRepository extends BaseRepository<ApplianceSession> implements IApplianceSessionRepository {
  constructor() {
    super(applianceSessions);
  }

  async findByLocationId(locationId: string): Promise<any[]> {
    const sessions = await db
      .select()
      .from(applianceSessions)
      .where(eq(applianceSessions.locationId, locationId))
      .orderBy(applianceSessions.date);
    return sessions;
  }

  async findByLocationIdAndType(locationId: string, applianceType: string): Promise<any[]> {
    const sessions = await db
      .select()
      .from(applianceSessions)
      .where(and(
        eq(applianceSessions.locationId, locationId),
        eq(applianceSessions.applianceType, applianceType)
      ))
      .orderBy(applianceSessions.date);
    return sessions;
  }
}
