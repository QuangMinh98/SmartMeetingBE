import { Injectable } from '@nestjs/common';
import { IFDevice } from './interface';
import { DeviceRepository } from './devices.repository';
import { DeviceDto } from './dto/dto';
import { RoomRepository, IFRoom } from '../rooms';
import { CestronService } from '../cestron';
import { EventEmitter2 } from 'eventemitter2';
import { AbstractSubject } from '../observer';

@Injectable()
export class DeviceService{
    constructor(
        private readonly deviceRepo: DeviceRepository,
        private readonly roomRepo: RoomRepository,
        private eventEmitter: EventEmitter2
    ) {}

    async create(deviceData: DeviceDto) {
        return this.deviceRepo.create(deviceData);
    }

    async getAll({ page, limit }: { page?: number; limit?: number }) {
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.deviceRepo.findAllAndPaging({
            page,
            limit,
            sort: { created_time: -1 }
        });
    }

    async getById(id: string) {
        return this.deviceRepo.findById(id);
    }

    async getByRoomId(id: string, { page, limit }: { page?: number; limit?: number }) {
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        // Get room data from id, then use id of this room to filter results
        const room: IFRoom = await this.roomRepo.findById(id);

        return this.deviceRepo.findAllAndPaging(
            {
                page,
                limit,
                sort: { created_time: -1 }
            },
            { room: room.id }
        );
    }

    async update(id: string, deviceData: DeviceDto) {
        return this.deviceRepo.updateById(id, deviceData, { new: true });
    }

    async updateValue(id: string, { current_value, is_on }: { current_value: number; is_on: boolean }) {
        const device: IFDevice = await this.deviceRepo.updateValue(id, { current_value, is_on });
        // Send notify to cestron service
        this.eventEmitter.emit('device.UpdateValue', device);

        return device;
    }

    async delete(id: string) {
        return this.deviceRepo.deleteById(id);
    }
}
