import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../rooms';
import { MeetingDto } from './dto/dto';
import { Meeting } from './model';
import { IFMeeting } from './interface';
import { AbstractSubject } from '../observer';

@Injectable()
export class MeetingRepository{

    constructor(private readonly roomRepo: RoomRepository) {}

    fromEntity(data: any): IFMeeting {
        return data;
    }

    async countDocuments(filter?: any): Promise<number> {
        return await Meeting.countDocuments(filter);
    }

    /**
     * This function used to create a new meeting and save it to database.
     * Create a meeting object, than check if the time of this meeting is overlapped with another meeting
     * If not being Duplicate, meeting data will save to database
     * @returns meeting data
     */
    async create(meetingData: MeetingDto, checkIfRoomAble?: Function): Promise<IFMeeting> {
        const meeting: IFMeeting = new Meeting(meetingData);
        meeting.setTime();
        // A callback to check if there is a meeting created at this time before save new meeting to database
        if(checkIfRoomAble) await checkIfRoomAble(meeting);
        await meeting.save();

        return meeting;
    }

    async getAll(filter?: any): Promise<IFMeeting[]> {
        const meeting: IFMeeting[] = await Meeting.find(filter)
            .populate('room')
            .populate('type')
            .sort({ start_time: 'desc' });

        return meeting;
    }

    /**
     * This function is used to get all meetings and group them by date
     */
    async getAllAndGroupByDate(filter?: any): Promise<Array<IFMeeting[]>> {
        const result = await Meeting.findAndGroupByDate(filter);
        return result;
    }

    async getByRoom(id: string, filter?: any) {
        try{
            const room = await this.roomRepo.findById(id);
            const meetings: IFMeeting[] = await Meeting.find({ room: room._id, ...filter }).populate('type');

            return {
                room,
                meetings
            };
        }
        catch(err){
            throw new NotFoundException('Room not found');
        }
    }

    async getOne(filter?: any): Promise<IFMeeting> {
        try{
            const meeting: IFMeeting = await Meeting.findOne(filter);
            if(!meeting) throw new HttpException({error_code: '404', error_message: 'Meeting not found'}, 404);

            return meeting;
        }
        catch(err){
            throw new HttpException({error_code: '404', error_message: 'Meeting not found'}, 404);
        }
    }

    async updateOne(
        meetingData: MeetingDto,
        filter?: any,
        checkIfRoomAble?: Function
    ): Promise<IFMeeting>{
        const meeting: IFMeeting = await Meeting.findOne(filter);
        if(!meeting) throw new HttpException({error_code: '404', error_message: 'Meeting not found'}, 404);

        // Update data of meeting variable with data of meetingData variable
        Object.assign(meeting, meetingData);
        meeting.setTime();
        // A callback to check if there is a meeting created at this time before save new meeting to database
        if(checkIfRoomAble) await checkIfRoomAble(meeting);

        return meeting;
    }

    async deleteOne(filter?: any): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOneAndDelete(filter);
        if(!meeting) throw new HttpException({error_code: '404', error_message: 'Meeting not found'}, 404);

        return meeting;
    }
}