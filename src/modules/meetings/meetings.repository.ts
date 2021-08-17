import { Injectable, NotFoundException } from "@nestjs/common";
import { ResponseRepository, IFResponse } from '../response';
import { RoomRepository } from "../rooms";
import { MeetingDto } from "./dto/dto";
import { Meeting } from "./model"
import { IFMeeting } from "./interface"

@Injectable()
export class MeetingRepository {

    constructor(private readonly roomRepo: RoomRepository) {}

    fromEntity(data: any): IFMeeting {
        return data
    }

    setTime(meeting: IFMeeting): void{
        meeting.day_of_week = (new Date(meeting.start_time)).getDay()
        meeting.time = {
            start: (meeting.start_time + 25200000)%86400000,
            end: (meeting.end_time + 25200000)%86400000,
            date: (new Date(meeting.start_time)).getDate()
        }
    }

    async create(meetingData: MeetingDto): Promise<IFMeeting> {
        const meeting: IFMeeting = new Meeting(meetingData);
        await meeting.save();

        this.setTime(meeting)

        return meeting;
    }

    async getAll(filter?: any): Promise<IFMeeting[]> {
        const meeting: IFMeeting[] = await Meeting.find(filter)
            .populate('room')
            .populate('type')

        return meeting
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

        this.setTime(meeting)
        await meeting.save()

        return meeting
    }

    async deleteOne(filter?: any): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOneAndDelete(filter)
        if(!meeting) throw new NotFoundException("Meeting not found")

        return meeting
    }
}