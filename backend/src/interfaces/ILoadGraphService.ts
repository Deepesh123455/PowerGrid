import { LoadGraph } from '../db/schema.js';

export interface ILoadGraphService {
    getLoadGraphsByLocationIdAndInterval(locationId: string, intervalType: string): Promise<LoadGraph[]>;
    getAllLoadGraphsByLocationId(locationId: string): Promise<LoadGraph[]>;
}
