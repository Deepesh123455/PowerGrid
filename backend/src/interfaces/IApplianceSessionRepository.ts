import { IRepository } from './IRepository.js';
import { ApplianceSession } from '../db/schema.js';

export interface IApplianceSessionRepository extends IRepository<ApplianceSession> {
  findByLocationId(locationId: string): Promise<any[]>;
  findByLocationIdAndType(locationId: string, applianceType: string): Promise<any[]>;
}
