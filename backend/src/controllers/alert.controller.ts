import { Request, Response, NextFunction } from 'express';
import { alertService } from '../services/alert.service.js';

export const getAlertsByLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { locationId } = req.params;
    const alerts = await alertService.getAlerts(locationId);

    res.status(200).json({
      status: 'success',
      data: {
        alerts,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { locationId } = req.params;
    const count = await alertService.getUnreadCount(locationId);

    res.status(200).json({
      status: 'success',
      data: {
        unreadCount: count,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const markAlertAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alertId } = req.params;
    const updatedAlert = await alertService.markAsRead(alertId);

    res.status(200).json({
      status: 'success',
      data: {
        alert: updatedAlert,
      },
    });
  } catch (err) {
    next(err);
  }
};
