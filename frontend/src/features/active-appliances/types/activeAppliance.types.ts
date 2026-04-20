export interface ActiveAppliance {
  applianceId: string;
  locationId: string;
  name: string;
  type: string;
  currentDrawKw: number;
  startedAt: string;
  isDetectedByAI: boolean;
}

export interface ActiveAppliancesResponse {
  status: 'success' | 'error';
  results: number;
  data: ActiveAppliance[];
}
