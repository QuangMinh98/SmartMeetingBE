import { Injectable, NotFoundException } from "@nestjs/common";
import { ResponseRepository, IFResponse } from "../response";
import { IFMeetingType } from "./interface";
import { MeetingType } from "./model";

@Injectable()
export class MeetingTypeRepository {

    constructor(private readonly responseRepo: ResponseRepository) {}

    async findAllAndPaging(
        { page, limit, sort}: { page: number, limit: number, sort?: any},
        filter?: any
    ): Promise<IFResponse<IFMeetingType>>{
        let skip: number = 0;
        skip = (page -1) * limit;

        const meetingTypes = await MeetingType.find(filter)
            .limit(+limit)
            .skip(+skip)
            .sort(sort);
        const totalRecords: number = await MeetingType.countDocuments(filter)

        return this.responseRepo.getResponse<IFMeetingType>(meetingTypes, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFMeetingType[]>{
        return await MeetingType.find(filter)
    }

    async findById(id: string): Promise<IFMeetingType> {
        try{
            const meetingType = await MeetingType.findById(id);
            if(!meetingType) throw new NotFoundException("Meeting type not found")

            return meetingType
        }
        catch(err){
            throw new NotFoundException("Meeting type not found")
        }
    }

}