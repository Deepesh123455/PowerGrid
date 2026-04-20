import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.js';
import { ActiveApplianceRepository } from '../repositories/activeAppliance.repository.js';
import { ActiveApplianceService } from '../services/activeAppliance.service.js';
import { IActiveApplianceService } from '../interfaces/IActiveApplianceService.js';

const activeApplianceRepository = new ActiveApplianceRepository();
const activeApplianceService: IActiveApplianceService = new ActiveApplianceService(
  activeApplianceRepository
);

export const getActiveAppliances = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const locationId = typeof req.query.locationId === 'string' ? req.query.locationId : undefined;
    const appliances = await activeApplianceService.getActiveAppliances(locationId);

    res.status(200).json({
      status: 'success',
      results: appliances.length,
      data: appliances,
    });
  }
);
