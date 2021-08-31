import { Injectable, NotFoundException } from "@nestjs/common";
import { RoomRepository } from "../rooms";
import { MeetingDto } from "./dto/dto";
import { Meeting } from "./model"
import { IFMeeting } from "./interface"
import { MeetingObserver, MeetingSubject } from "./meeting-observer";

@Injectable()
export class MeetingRepository implements MeetingSubject {

    constructor(private readonly roomRepo: RoomRepository) {}

    private observers: MeetingObserver[] = [];

    /**
     * The subscription management methods.
     */
    public attach(observer: MeetingObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: MeetingObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    /**
     * Trigger an update in each subscriber.
     */
    public notify(meeting: IFMeeting): void {
        for (const observer of this.observers) {
            observer.observerNotify(meeting);
        }
    }

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
        if(!meeting) throw new NotFoundException("Meeting not found")

        return meeting
    }

    async updateOne(
        meetingData: MeetingDto,
        filter?: any,
        checkIfRoomAble?: Function
    ): Promise<IFMeeting>{
        const meeting: IFMeeting = await Meeting.findOne(filter)
        if(!meeting) throw new NotFoundException("Meeting not found")

        Object.assign(meeting, meetingData)
        meeting.setTime()

        if(checkIfRoomAble) await checkIfRoomAble(meeting)

        return meeting
    }

    async deleteOne(filter?: any): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOneAndDelete(filter)
        if(!meeting) throw new NotFoundException("Meeting not found")

        return meeting
    }
}