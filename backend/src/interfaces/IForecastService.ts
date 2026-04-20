import { BillingForecast } from '../db/schema.js';

export interface IForecastService {
    getForecastByLocationId(locationId: string): Promise<Partial<BillingForecast>>;
}
