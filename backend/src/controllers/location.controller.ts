import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/location.service.js';
import { LocationRepository } from '../repositories/location.repository.js';

// Initialize dependencies
const locationRepository = new LocationRepository();
const locationService = new LocationService(locationRepository);

export const getUserLocations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We fetch userId from token if protect middleware is applied
    // For now we assume a query param or request user property. 
    // Fallback to query param 'userId' if req.user is absent due to bypass
    const userId = (req as any).user?.userId || req.query.userId || req.params.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ status: 'error', message: 'User ID is required. Pass ?userId= in query.' });
    }

    const locations = await locationService.getLocationsByUserId(userId);

    res.status(200).json({
      status: 'success',
      data: {
        locations
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await locationService.deleteLocation(id);

    res.status(200).json({
      status: 'success',
      message: 'Location deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
