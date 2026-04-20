export type AlertSeverity = 'INFO' | 'WARNING' | 'URGENT';
export type AlertCategory = 'EV' | 'USAGE' | 'BILLING' | 'OUTAGE' | 'TARIFF';

export interface Alert {
  alertId: string;
  locationId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string; // ISO 8601 string
  isRead: boolean;
}

export interface GetAlertsResponse {
  status: string;
  data: {
    alerts: Alert[];
  };
}

export interface GetUnreadCountResponse {
  status: string;
  data: {
    unreadCount: number;
  };
}

export interface MarkAsReadResponse {
  status: string;
  data: {
    alert: Alert;
  };
}
