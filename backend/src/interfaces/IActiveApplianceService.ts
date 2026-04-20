import { ActiveAppliance } from '../db/schema.js';

export interface IActiveApplianceService {
  getActiveAppliances(locationId?: string): Promise<Partial<ActiveAppliance>[]>;
}
