import { IApplianceSessionService } from '../interfaces/IApplianceSessionService.js';
import { IApplianceSessionRepository } from '../interfaces/IApplianceSessionRepository.js';

export class ApplianceSessionService implements IApplianceSessionService {
  private applianceSessionRepository: IApplianceSessionRepository;

  constructor(applianceSessionRepository: IApplianceSessionRepository) {
    this.applianceSessionRepository = applianceSessionRepository;
  }

  async getApplianceSessions(locationId: string): Promise<any[]> {
    try {
      return await this.applianceSessionRepository.findByLocationId(locationId);
    } catch (error) {
      console.error('Error fetching appliance sessions:', error);
      throw error;
    }
  }

  async getApplianceSessionsByType(locationId: string, applianceType: string): Promise<any[]> {
    try {
      return await this.applianceSessionRepository.findByLocationIdAndType(locationId, applianceType);
    } catch (error) {
      console.error(`Error fetching ${applianceType} sessions:`, error);
      throw error;
    }
  }
}
