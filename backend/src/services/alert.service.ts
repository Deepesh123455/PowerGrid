import { alertRepository } from '../repositories/alert.repository.js';
import AppError from '../utils/AppError.js';
import { Alert } from '../db/schema.js';

export class AlertService {
  async getAlerts(locationId: string): Promise<Alert[]> {
    if (!locationId) {
      throw new AppError('Location ID is required', 400);
    }
    return await alertRepository.getAlertsByLocationId(locationId);
  }

  async getUnreadCount(locationId: string): Promise<number> {
    if (!locationId) {
      throw new AppError('Location ID is required', 400);
    }
    return await alertRepository.getUnreadCountByLocationId(locationId);
  }

  async markAsRead(alertId: string): Promise<Alert> {
    if (!alertId) {
      throw new AppError('Alert ID is required', 400);
    }

    const updatedAlert = await alertRepository.markAlertAsRead(alertId);
    if (!updatedAlert) {
      throw new AppError('Alert not found', 404);
    }

    return updatedAlert;
  }
}

export const alertService = new AlertService();
