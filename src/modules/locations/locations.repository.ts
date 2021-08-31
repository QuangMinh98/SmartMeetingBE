import {
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ResponseRepository, IFResponse } from '../response'
import { LocationDto } from './dto/dto'
import { Location } from './schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { IFLocation } from './interface'

@Injectable()
export class LocationRepository {

    constructor(
        @InjectModel("Location") private readonly locationModel: Model<IFLocation>,
        private readonly responseRepo: ResponseRepository
    ){}

    fromEntity(data: any): IFLocation {
        return data
    }

    async create(locationData: LocationDto): Promise<IFLocation> {
        let location = new this.locationModel(locationData)
        location.setName()
        await location.save()
        
        return location
    }

    async findAllAndPaging(
        { page, limit, sort }: { page: number, limit: number, sort?: any},
        filter?: any
    ): Promise<IFResponse<IFLocation>> {
        let skip: number = 0;
        skip = (page -1) * limit;

        const locations = await this.locationModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        const totalRecords: number = await this.locationModel.countDocuments(filter)

        return this.responseRepo.getResponse<IFLocation>(locations, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFLocation[]> {
        return await this.locationModel.find(filter)
    }

    async findById(id: string): Promise<IFLocation>{
        try{
            const location = await this.locationModel.findById(id)
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
            const location = await this.locationModel.findByIdAndUpdate(id, locationData, options)
            if(!location) throw new NotFoundException("Location not found")

            return this.fromEntity(location)
        }
        catch(err){
            throw new NotFoundException("Location not found")
        }
    }

    async deleteById(id: string): Promise<IFLocation>{
        try{
            const location = await this.locationModel.findByIdAndDelete(id)
            if(!location) throw new NotFoundException("Location not found")

            return location
        }
        catch(err){
            throw new NotFoundException("Location not found")
        }
    }

}