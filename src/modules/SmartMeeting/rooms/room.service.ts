import { Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { RoomDto } from './dto/dto';

@Injectable()
export class RoomService {
    constructor(private readonly roomRepo: RoomRepository) {}

    async create(roomData: RoomDto) {
        return this.roomRepo.create(roomData);
    }

    getAll({ page, limit }: { page?: number; limit?: number }) {
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.roomRepo.findAllAndPaging({
            page,
            limit,
            sort: { created_time: -1 }
        });
    }

    getById(id: string) {
        return this.roomRepo.findById(id);
    }

    update(id: string, roomData: RoomDto) {
        return this.roomRepo.updateById(id, roomData, { new: true });
    }

    delete(id: string) {
        return this.roomRepo.deleteById(id);
    }
}
