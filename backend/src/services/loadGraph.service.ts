import { ILoadGraphRepository } from '../interfaces/ILoadGraphRepository.js';
import { ILoadGraphService } from '../interfaces/ILoadGraphService.js';
import AppError from '../utils/AppError.js';

export class LoadGraphService implements ILoadGraphService {
    private loadGraphRepository: ILoadGraphRepository;

    constructor(loadGraphRepository: ILoadGraphRepository) {
        this.loadGraphRepository = loadGraphRepository;
    }

    async getLoadGraphsByLocationIdAndInterval(locationId: string, intervalType: string) {
        const loadGraphs = await this.loadGraphRepository.findByLocationIdAndInterval(locationId, intervalType);

        if (!loadGraphs || loadGraphs.length === 0) {
            throw new AppError('Load graphs not found for this location and interval', 404);
        }

        return loadGraphs;
    }

    async getAllLoadGraphsByLocationId(locationId: string) {
        const loadGraphs = await this.loadGraphRepository.findByLocationId(locationId);

        if (!loadGraphs || loadGraphs.length === 0) {
            throw new AppError('Load graphs not found for this location', 404);
        }

        return loadGraphs;
    }
}
