export interface IApplianceSessionService {
  getApplianceSessions(locationId: string): Promise<any[]>;
  getApplianceSessionsByType(locationId: string, applianceType: string): Promise<any[]>;
}
