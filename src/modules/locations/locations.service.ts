import {
    Injectable
} from '@nestjs/common';
import { LocationDto } from './dto/dto';
import { LocationRepository } from './locations.repository';

@Injectable()
export class LocationService {

    constructor(private readonly locationRepo: LocationRepository ) {}

    async create(locationData: LocationDto){
        return this.locationRepo.create(locationData);
    }

    async getAll({ page, limit}: { page?: number, limit?: number}){
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.locationRepo.findAllAndPaging({
            page, 
            limit
        });
    }

    async getById(id: string){
        return this.locationRepo.findById(id);
    }

    async update(id, locationData: LocationDto){
        return this.locationRepo.updateById(id, locationData, { new: true });
    }

    async delete(id: string){
        return this.locationRepo.deleteById(id);
    }

}