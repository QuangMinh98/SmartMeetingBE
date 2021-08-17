import {
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { IFDevice } from './interface'
import { Device } from './model'
import { ResponseRepository, IFResponse} from '../response'
import { DeviceDto } from './dto/dto'

@Injectable()
export class DeviceRepository {
    
    constructor(private readonly responseRepo: ResponseRepository){}

    fromEntity(data: any): IFDevice {
        return data
    }

    async create(deviceData: DeviceDto): Promise<IFDevice>{
        const device = new Device(deviceData)
        await device.save()

        return device
    }

    async findAllAndPaging(
        { page, limit, sort}: { page: number, limit: number, sort?: any},
        filter?: any
    ): Promise<IFResponse<IFDevice>>{
        let skip: number = 0;
        skip = (page -1) * limit;

        const devices: IFDevice[] = await Device.find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sort);
        const totalRecords: number = await Device.countDocuments(filter)

        return this.responseRepo.getResponse<IFDevice>(devices, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFDevice[]>{
        return await Device.find(filter)
    }

    async findById(id: string): Promise<IFDevice>{
        try{
            const device: IFDevice = await Device.findById(id)
            if(!device) throw new NotFoundException("Device not found")

            return device
        }
        catch(err) {
            throw new NotFoundException("Device not found")
        }
    }

    async updateById(
        id: string, 
        deviceData: DeviceDto, 
        options?: any
    ): Promise<IFDevice>{
        try{
            const device = await Device.findByIdAndUpdate(id, deviceData, options)
            if(!device) throw new NotFoundException("Device not found")

            return this.fromEntity(device)
        }
        catch(err) {
            throw new NotFoundException("Device not found")
        }
    }

    async updateValue(
        id: string, 
        {current_value, is_on} : { current_value: number, is_on: boolean}
    ): Promise<IFDevice>{
        try{
            const device: IFDevice = await Device.findById(id)
            if(!device) throw new NotFoundException("Device not found")

            // If device is off
            if(device.device_type === 1){
                if(is_on == false || current_value == 0){
                    is_on = false
                    current_value = 0
                }
            }

            device.is_on = is_on
            if(device.device_type === 1 && current_value >= device.min_value && current_value <= device.max_value){
                device.current_value = current_value
            }

            device.save()

            return device
        }
        catch(err) {
            throw new NotFoundException("Device not found")
        }
    }

    async deleteById(id: string): Promise<IFDevice>{
        try{
            const device: IFDevice = await Device.findByIdAndDelete(id)
            if(!device) throw new NotFoundException("Device not found")

            return device
        }
        catch(err) {
            throw new NotFoundException("Device not found")
        }
    }
}