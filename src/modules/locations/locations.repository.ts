import {
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ResponseRepository, IFResponse } from '../response'
import { LocationDto } from './dto/dto'
import { Location } from './model'
import { IFLocation } from './interface'

@Injectable()
export class LocationRepository {

    constructor(private readonly responseRepo: ResponseRepository){}

    fromEntity(data: any): IFLocation {
        return data
    }

    async create(locationData: LocationDto): Promise<IFLocation> {
        const location = new Location(locationData)
        await location.save()
        
        return location
    }

    async findAllAndPaging(
        { page, limit, sort }: { page: number, limit: number, sort?: any},
        filter?: any
    ): Promise<IFResponse<IFLocation>> {
        let skip: number = 0;
        skip = (page -1) * limit;

        const locations: IFLocation[] = await Location.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        const totalRecords: number = await Location.countDocuments(filter)

        return this.responseRepo.getResponse<IFLocation>(locations, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFLocation[]> {
        return await Location.find(filter)
    }

    async findById(id: string): Promise<IFLocation>{
        try{
            const location: IFLocation = await Location.findById(id)
            if(!location) throw new NotFoundException("Location not found")

            return location
        }
        catch(err){
            throw new NotFoundException("Location not found")
        }
    }

    async updateById(
        id: string, 
        locationData: LocationDto,
        options: any
    ): Promise<IFLocation>{
        try{
            const location = await Location.findByIdAndUpdate(id, locationData, options)
            if(!location) throw new NotFoundException("Location not found")

            return this.fromEntity(location)
        }
        catch(err){
            throw new NotFoundException("Location not found")
        }
    }

    async deleteById(id: string): Promise<IFLocation>{
        try{
            const location = await Location.findByIdAndDelete(id)
            if(!location) throw new NotFoundException("Location not found")

            return location
        }
        catch(err){
            throw new NotFoundException("Location not found")
        }
    }

}