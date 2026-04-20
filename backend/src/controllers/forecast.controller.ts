import { Request, Response, NextFunction } from 'express';
import { ForecastService } from '../services/forecast.service.js';
import { ForecastRepository } from '../repositories/forecast.repository.js';
import { IForecastService } from '../interfaces/IForecastService.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const forecastRepository = new ForecastRepository();
const forecastService: IForecastService = new ForecastService(forecastRepository);

export const getForecast = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { locationId } = req.params;

    if (!locationId) {
        return next(new AppError('Location ID is required', 400));
    }

    const forecast = await forecastService.getForecastByLocationId(locationId);

    res.status(200).json({
        status: 'success',
        data: forecast
    });
});
