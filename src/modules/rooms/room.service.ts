import {
    forwardRef,
    Inject,
    Injectable
} from '@nestjs/common'
import { RoomRepository } from './room.repository'
import { RoomDto } from './dto/dto'
import { CestronRepository } from '../cestron';

@Injectable()
export class RoomService {

    constructor(
        private readonly roomRepo: RoomRepository,
        @Inject(forwardRef(() => CestronRepository)) 
        private readonly cestronRepo: CestronRepository
    ) {}

    async create(roomData: RoomDto){
        try{
            roomData.cestron_room_id = await this.cestronRepo.createRoom({
                roomName: roomData.name,
                description: ` Description for ${roomData.name}`
            })
        }
        catch(err){
            console.log(err.message)
        }
        return this.roomRepo.create(roomData)
    }

    getAll({ page, limit }: { page?: number, limit?: number}){
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
        })
    }

    getById(id: string){
        return this.roomRepo.findById(id)
    }

    update(id: string, roomData: RoomDto){
        return this.roomRepo.updateById(id, roomData, {new: true})
    }

    delete(id: string) {
        return this.roomRepo.deleteById(id)
    }
}   