import { eq, desc, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { Alert } from '../db/schema.js';

export class AlertRepository {
  async getAlertsByLocationId(locationId: string): Promise<Alert[]> {
    return db
      .select()
      .from(schema.alerts)
      .where(eq(schema.alerts.locationId, locationId))
      .orderBy(desc(schema.alerts.timestamp));
  }

  async getUnreadCountByLocationId(locationId: string): Promise<number> {
    const result = await db
      .select({ count: schema.alerts.alertId })
      .from(schema.alerts)
      .where(
        and(
          eq(schema.alerts.locationId, locationId),
          eq(schema.alerts.isRead, false)
        )
      );
    return result.length;
  }

  async markAlertAsRead(alertId: string): Promise<Alert | undefined> {
    const [updatedAlert] = await db
      .update(schema.alerts)
      .set({ isRead: true })
      .where(eq(schema.alerts.alertId, alertId))
      .returning();
    
    return updatedAlert;
  }
}

export const alertRepository = new AlertRepository();
