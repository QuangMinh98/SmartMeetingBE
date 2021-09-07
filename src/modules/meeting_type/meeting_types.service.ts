import { Injectable } from '@nestjs/common';
import { MeetingTypeRepository } from './meeting_types.repository';

@Injectable()
export class MeetingTypeService {

    constructor(private readonly meetingTypeRepo: MeetingTypeRepository) {}

    getAll({ page, limit }: { page?: number, limit?: number}){
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.meetingTypeRepo.findAllAndPaging({
            page,
            limit,
            sort: { created_time: -1 }
        })
    }

}