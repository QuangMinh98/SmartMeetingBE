import {
    HttpException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { IFDevice } from './interface';
import { Device } from './model';
import { ResponseRepository, IFResponse} from '../response';
import { DeviceDto } from './dto/dto';
import { AbstractSubject } from '../observer';

@Injectable()
export class DeviceRepository extends AbstractSubject {
    
    constructor(private readonly responseRepo: ResponseRepository){ super(); }

    fromEntity(data: any): IFDevice {
        return data;
    }

    async create(deviceData: DeviceDto): Promise<IFDevice>{
        const device = new Device(deviceData);
        await device.save();

        return device;
    }

    async findAllAndPaging(
        { page, limit, sort}: { page: number, limit: number, sort?: any},
        filter?: any
    ): Promise<IFResponse<IFDevice>>{
        let skip = 0;
        skip = (page -1) * limit;

        const devices: IFDevice[] = await Device.find(filter)
            .limit(+limit)
            .skip(skip)
            .sort(sort);
        const totalRecords: number = await Device.countDocuments(filter);

        return this.responseRepo.getResponse<IFDevice>(devices, totalRecords, page, limit);
    }

    async findAll(filter?: any): Promise<IFDevice[]>{
        return await Device.find(filter);
    }

    async findById(id: string): Promise<IFDevice>{
        try{
            const device: IFDevice = await Device.findById(id);
            if(!device) throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);

            return device;
        }
        catch(err) {
            throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);
        }
    }

    async updateById(
        id: string, 
        deviceData: DeviceDto, 
        options?: any
    ): Promise<IFDevice>{
        try{
            const device = await Device.findByIdAndUpdate(id, deviceData, options);
            if(!device) throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);

            return this.fromEntity(device);
        }
        catch(err) {
            throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);
        }
    }

    async updateValue(
        id: string, 
        {current_value, is_on} : { current_value: number, is_on: boolean}
    ): Promise<IFDevice>{
        try{
            const device: IFDevice = await Device.findById(id);
            if(!device) throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);

            // If the device state is inactive (is_on == false) 
            // The current_value of this device will be adjusted to 0 and vice versa
            if(device.device_type === 1){
                if(is_on == false || current_value == 0){
                    is_on = false;
                    current_value = 0;
                }
            }

            device.is_on = is_on;
            if(device.device_type === 1 && current_value >= device.min_value && current_value <= device.max_value){
                device.current_value = current_value;
            }

            device.save();

            // Send notify to cestron service
            this.notify({ device }, 'Update device value');

            return device;
        }
        catch(err) {
            throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);
        }
    }

    async deleteById(id: string): Promise<IFDevice>{
        try{
            const device: IFDevice = await Device.findByIdAndDelete(id);
            if(!device) throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);

            return device;
        }
        catch(err) {
            throw new HttpException({error_code: '404', error_message: 'Device not found'}, 404);
        }
    }
}