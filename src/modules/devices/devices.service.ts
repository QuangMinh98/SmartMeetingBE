import {
    Injectable
} from '@nestjs/common'
import { IFDevice } from './interface'
import { DeviceRepository } from './devices.repository'
import { DeviceDto } from './dto/dto'
import { RoomRepository, IFRoom } from '../rooms'
import { CestronRepository, CestronService } from '../cestron'

@Injectable()
export class DeviceService {
    
    constructor(
        private readonly deviceRepo: DeviceRepository,
        private readonly roomRepo: RoomRepository,
        private readonly cestronService: CestronService
    ) {}

    async create(deviceData: DeviceDto){
        return this.deviceRepo.create(deviceData)
    }

    async getAll({ page, limit }: { page?: number, limit?: number}){
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.deviceRepo.findAllAndPaging({
            page,
            limit,
            sort: {created_time: -1}
        })
    }

    async getById(id: string){
        return this.deviceRepo.findById(id)
    }

    async getByRoomId(
        id: string, 
        { page, limit}: { page?: number, limit?: number}
    ){
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }
        const room: IFRoom = await this.roomRepo.findById(id);

        return this.deviceRepo.findAllAndPaging({
            page,
            limit,
            sort: {created_time: -1}
        }, { room: room.id })
    }

    async update(id: string, deviceData: DeviceDto){
        return this.deviceRepo.updateById(id, deviceData, { new: true })
    }

    async updateValue(
        id: string,
        { current_value, is_on }: { current_value: number; is_on: boolean}
    ){
        const device: IFDevice = await this.deviceRepo.updateValue(id,{ current_value, is_on})

        // Update device value on cestron thingworx
        this.cestronService.updateDeviceValue({
            AttributeID: (device.device_type === 1 || device.is_on === true) ? device.cestron_device_id : device.cestron_device_id_off,
            value: (device.device_type === 1) ? device.current_value : device.is_on
        })

        return device
    }

    async delete(id: string){
        return this.deviceRepo.deleteById(id)
    }
}