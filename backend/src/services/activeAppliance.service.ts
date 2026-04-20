import AppError from '../utils/AppError.js';
import { IActiveApplianceRepository } from '../interfaces/IActiveApplianceRepository.js';
import { IActiveApplianceService } from '../interfaces/IActiveApplianceService.js';

export class ActiveApplianceService implements IActiveApplianceService {
  private activeApplianceRepository: IActiveApplianceRepository;

  constructor(activeApplianceRepository: IActiveApplianceRepository) {
    this.activeApplianceRepository = activeApplianceRepository;
  }

  async getActiveAppliances(locationId?: string) {
    const appliances = await this.activeApplianceRepository.findAllActive(locationId);

    if (!appliances.length) {
      throw new AppError('No active appliances found', 404);
    }

    return appliances;
  }
}
