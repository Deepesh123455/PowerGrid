import { IRepository } from './IRepository.js';
import { BillingForecast } from '../db/schema.js';

export interface IForecastRepository extends IRepository<BillingForecast> {
    findByLocationId(locationId: string): Promise<Partial<BillingForecast> | null>;
}
