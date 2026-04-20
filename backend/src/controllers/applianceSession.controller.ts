import { Request, Response, NextFunction } from 'express';
import { ApplianceSessionService } from '../services/applianceSession.service.js';
import { ApplianceSessionRepository } from '../repositories/applianceSession.repository.js';
import { IApplianceSessionService } from '../interfaces/IApplianceSessionService.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const applianceSessionRepository = new ApplianceSessionRepository();
const applianceSessionService: IApplianceSessionService = new ApplianceSessionService(applianceSessionRepository);

export const getApplianceSessions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { locationId } = req.params;

  if (!locationId) {
    return next(new AppError('Location ID is required', 400));
  }

  const sessions = await applianceSessionService.getApplianceSessions(locationId);

  res.status(200).json({
    status: 'success',
    data: sessions,
  });
});

export const getApplianceSessionsByType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { locationId, applianceType } = req.params;

  if (!locationId) {
    return next(new AppError('Location ID is required', 400));
  }

  if (!applianceType) {
    return next(new AppError('Appliance type is required', 400));
  }

  const sessions = await applianceSessionService.getApplianceSessionsByType(locationId, applianceType);

  res.status(200).json({
    status: 'success',
    data: sessions,
  });
});
