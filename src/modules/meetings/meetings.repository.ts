import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { RoomRepository } from "../rooms";
import { MeetingDto } from "./dto/dto";
import { Meeting } from "./model"
import { IFMeeting } from "./interface"
import { AbstractMeetingSubject } from "./meeting-observer";

@Injectable()
export class MeetingRepository extends AbstractMeetingSubject {

    constructor(private readonly roomRepo: RoomRepository) { super() }

    fromEntity(data: any): IFMeeting {
        return data
    }

    async countDocuments(filter?: any): Promise<Number> {
        return await Meeting.countDocuments(filter)
    }

    async create(meetingData: MeetingDto, checkIfRoomAble?: Function): Promise<IFMeeting> {
        const meeting: IFMeeting = new Meeting(meetingData);
        meeting.setTime()

        if(checkIfRoomAble) await checkIfRoomAble(meeting)

        await meeting.save();

        this.notify(meeting)

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
        if(!meeting) throw new HttpException({error_code: "404", error_message: "Meeting not found"}, 404)

        return meeting
    }

    async updateOne(
        meetingData: MeetingDto,
        filter?: any,
        checkIfRoomAble?: Function
    ): Promise<IFMeeting>{
        let meeting: IFMeeting = await Meeting.findOne(filter)
        if(!meeting) throw new HttpException({error_code: "404", error_message: "Meeting not found"}, 404)

        Object.assign(meeting, meetingData)
        meeting.setTime()

        if(checkIfRoomAble) await checkIfRoomAble(meeting)

        await meeting.save()

        return meeting
    }

    async deleteOne(filter?: any): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOneAndDelete(filter)
        if(!meeting) throw new HttpException({error_code: "404", error_message: "Meeting not found"}, 404)

        return meeting
    }
}