import { IForecastRepository } from '../interfaces/IForecastRepository.js';
import { IForecastService } from '../interfaces/IForecastService.js';
import AppError from '../utils/AppError.js';

export class ForecastService implements IForecastService {
    private forecastRepository: IForecastRepository;

    constructor(forecastRepository: IForecastRepository) {
        this.forecastRepository = forecastRepository;
    }

    async getForecastByLocationId(locationId: string) {
        const forecast = await this.forecastRepository.findByLocationId(locationId);

        if (!forecast) {
            throw new AppError('Forecast not found for this location', 404);
        }

        return forecast;
    }
}
