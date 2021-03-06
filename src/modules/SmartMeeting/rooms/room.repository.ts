import { HttpException, Injectable } from '@nestjs/common';
import { Room } from './model';
import { IFRoom } from './interface';
import { RoomDto } from './dto/dto';
import { ResponseService, IFResponse } from 'src/shared';

@Injectable()
export class RoomRepository {
    constructor(private readonly responseService: ResponseService) {}

    fromEntity(data: any): IFRoom {
        return data;
    }

    async create(roomData: RoomDto) {
        const room = new Room(roomData);
        await room.save();

        return room;
    }

    async findAllAndPaging(
        { page, limit, sort }: { page: number; limit: number; sort?: any },
        filter?: any
    ): Promise<IFResponse<IFRoom>> {
        let skip = 0;
        skip = (page - 1) * limit;

        const rooms: IFRoom[] = await Room.find(filter).limit(limit).skip(skip).sort(sort);
        const totalRecords: number = await Room.countDocuments(filter);

        return this.responseService.getResponse<IFRoom>(rooms, totalRecords, +page, +limit);
    }

    async findAll(filter?: any): Promise<IFRoom[]> {
        return await Room.find(filter);
    }

    async findById(id: string): Promise<IFRoom> {
        try {
            const room: IFRoom = await Room.findById(id);
            if (!room) throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404);

            return room;
        } catch (err) {
            throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404);
        }
    }

    async updateById(id: string, roomData: RoomDto, options?: any): Promise<IFRoom> {
        try {
            const room = await Room.findByIdAndUpdate(id, roomData, options);
            if (!room) throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404);

            return this.fromEntity(room);
        } catch (err) {
            throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404);
        }
    }

    async deleteById(id: string): Promise<IFRoom> {
        try {
            const room = await Room.findByIdAndDelete(id);
            if (!room) throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404);

            return room;
        } catch (err) {
            throw new HttpException({ error_code: '404', error_message: 'Room not found' }, 404);
        }
    }
}
