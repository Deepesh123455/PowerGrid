import { db } from '../db/index.js';
import { loadGraphs, LoadGraph } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository.js';
import { ILoadGraphRepository } from '../interfaces/ILoadGraphRepository.js';

export class LoadGraphRepository extends BaseRepository<LoadGraph> implements ILoadGraphRepository {
    constructor() {
        super(loadGraphs);
    }

    async findByLocationIdAndInterval(locationId: string, intervalType: string): Promise<LoadGraph[]> {
        const result = await db.select()
            .from(loadGraphs)
            .where(
                and(
                    eq(loadGraphs.locationId, locationId),
                    eq(loadGraphs.intervalType, intervalType)
                )
            )
            .orderBy(loadGraphs.timestamp);
        return result;
    }

    async findByLocationId(locationId: string): Promise<LoadGraph[]> {
        const result = await db.select()
            .from(loadGraphs)
            .where(eq(loadGraphs.locationId, locationId))
            .orderBy(loadGraphs.timestamp);
        return result;
    }
}
