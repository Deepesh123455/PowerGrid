import { Request, Response, NextFunction } from 'express';
import { LoadGraphService } from '../services/loadGraph.service.js';
import { LoadGraphRepository } from '../repositories/loadGraph.repository.js';
import { ILoadGraphService } from '../interfaces/ILoadGraphService.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const loadGraphRepository = new LoadGraphRepository();
const loadGraphService: ILoadGraphService = new LoadGraphService(loadGraphRepository);

export const getLoadGraphs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { locationId, intervalType } = req.params;

    if (!locationId) {
        return next(new AppError('Location ID is required', 400));
    }

    if (!intervalType) {
        return next(new AppError('Interval type (daily/weekly/monthly) is required', 400));
    }

    const loadGraphs = await loadGraphService.getLoadGraphsByLocationIdAndInterval(locationId, intervalType);

    res.status(200).json({
        status: 'success',
        data: loadGraphs
    });
});

export const getAllLoadGraphs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { locationId } = req.params;

    if (!locationId) {
        return next(new AppError('Location ID is required', 400));
    }

    const loadGraphs = await loadGraphService.getAllLoadGraphsByLocationId(locationId);

    res.status(200).json({
        status: 'success',
        data: loadGraphs
    });
});
