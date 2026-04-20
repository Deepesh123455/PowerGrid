import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { activeAppliances, ActiveAppliance } from '../db/schema.js';
import { IActiveApplianceRepository } from '../interfaces/IActiveApplianceRepository.js';
import { BaseRepository } from './BaseRepository.js';

export class ActiveApplianceRepository
  extends BaseRepository<ActiveAppliance>
  implements IActiveApplianceRepository
{
  constructor() {
    super(activeAppliances);
  }

  async findAllActive(locationId?: string): Promise<Partial<ActiveAppliance>[]> {
    const baseQuery = db
      .select({
        applianceId: activeAppliances.applianceId,
        locationId: activeAppliances.locationId,
        name: activeAppliances.name,
        type: activeAppliances.type,
        currentDrawKw: activeAppliances.currentDrawKw,
        startedAt: activeAppliances.startedAt,
        isDetectedByAI: activeAppliances.isDetectedByAI,
      })
      .from(activeAppliances);

    if (locationId) {
      return baseQuery
        .where(eq(activeAppliances.locationId, locationId))
        .orderBy(desc(activeAppliances.currentDrawKw));
    }

    return baseQuery.orderBy(desc(activeAppliances.currentDrawKw));
  }
}
