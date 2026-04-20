import { ActiveAppliance } from '../db/schema.js';
import { IRepository } from './IRepository.js';

export interface IActiveApplianceRepository extends IRepository<ActiveAppliance> {
  findAllActive(locationId?: string): Promise<Partial<ActiveAppliance>[]>;
}
