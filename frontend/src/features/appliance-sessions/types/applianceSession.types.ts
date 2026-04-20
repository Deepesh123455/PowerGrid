export interface ApplianceSession {
  sessionId: string;
  locationId: string;
  applianceType: string;
  date: string;
  startTime: string;
  endTime: string;
  energyKwh: number;
  estimatedCostInr: number;
  confidenceScore: number;
  status: string;
  avgPowerKw: number;
}

export interface ApplianceSessionResponse {
  status: string;
  data: ApplianceSession[];
}
