export interface LoadGraphData {
  id: number;
  locationId: string;
  intervalType: 'daily' | 'weekly' | 'monthly';
  timestamp: string;
  label?: string;
  weatherSensitiveLoad: number;
  timeSensitiveLoad: number;
  normalLoad: number;
  totalLoad: number;
}

export interface LoadGraphResponse {
  status: 'success' | 'error';
  data: LoadGraphData[];
}
