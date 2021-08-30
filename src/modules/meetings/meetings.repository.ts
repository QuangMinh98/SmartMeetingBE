import { Injectable, NotFoundException } from "@nestjs/common";
import { ResponseRepository, IFResponse } from '../response';
import { RoomRepository } from "../rooms";
import { MeetingDto } from "./dto/dto";
import { Meeting } from "./model"
import { IFMeeting } from "./interface"
import { MeetingObserver, Observer, Subject } from "./meetings-observer"

@Injectable()
export class MeetingRepository {

    constructor(private readonly roomRepo: RoomRepository) {}

    fromEntity(data: any): IFMeeting {
        return data
    }

    async create(meetingData: MeetingDto): Promise<IFMeeting> {
        const meeting: IFMeeting = new Meeting(meetingData);
        await meeting.save();

        meeting.setTime()

        return meeting;
    }

    async getAll(filter?: any): Promise<IFMeeting[]> {
        const meeting: IFMeeting[] = await Meeting.find(filter)
            .populate('room')
            .populate('type')
            .sort({ start_time: 'desc' })

        return meeting
    }

    async getAllAndGroupByDate(filter?: any): Promise<Array<IFMeeting[]>> {
        const result = await Meeting.findAndGroupByDate(filter)

        return result
    }

    async getByRoom(id: string) {
        try{
            const room = await this.roomRepo.findById(id)

            const meetings: IFMeeting[] = await Meeting.find({ room: room._id }).populate('type')

            return {
                room,
                meetings
            }
        }
        catch(err){
            throw new NotFoundException("Room not found")
        }
    }

    async getOne(filter?: any): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOne(filter)
        if(!meeting) throw new NotFoundException("Meeting not found")

        return meeting
    }

    async updateOne(
        meetingData: MeetingDto,
        filter?: any
    ): Promise<IFMeeting>{
        const meeting: IFMeeting = await Meeting.findOne(filter)
        if(!meeting) throw new NotFoundException("Meeting not found")

        Object.assign(meeting, meetingData)

        meeting.setTime()
        await meeting.save()

        return meeting
    }

    async deleteOne(filter?: any): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOneAndDelete(filter)
        if(!meeting) throw new NotFoundException("Meeting not found")

        return meeting
    }
}