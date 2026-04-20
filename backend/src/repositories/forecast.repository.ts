import { db } from '../db/index.js';
import { billingForecast, BillingForecast } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository.js';
import { IForecastRepository } from '../interfaces/IForecastRepository.js';

export class ForecastRepository extends BaseRepository<BillingForecast> implements IForecastRepository {
    constructor() {
        super(billingForecast);
    }

    async findByLocationId(locationId: string): Promise<Partial<BillingForecast> | null> {
        const result = await db.select({
            billForecast: billingForecast.billForecast,
            aiConfidenceScore: billingForecast.aiConfidenceScore,
            vsLastMonth: billingForecast.vsLastMonth,
            forecastedDate: billingForecast.forecastedDate
        })
            .from(billingForecast)
            .where(eq(billingForecast.locationId, locationId))
            .limit(1);
        return result[0] || null;
    }
}
