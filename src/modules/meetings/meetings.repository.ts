import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../rooms';
import { MeetingDto } from './dto/dto';
import { Meeting } from './model';
import { IFMeeting } from './interface';
import { AbstractSubject } from '../observer';

@Injectable()
export class MeetingRepository extends AbstractSubject {

    constructor(private readonly roomRepo: RoomRepository) { super(); }

    fromEntity(data: any): IFMeeting {
        return data;
    }

    async countDocuments(filter?: any): Promise<number> {
        return await Meeting.countDocuments(filter);
    }

    /**
     * This function is used to create meetings that repeat by date
     * Loop while start time is less than until date
     * Each iteration will create a clone of @param meeting with new start_time and end_time
     */
    async createRepeatDaily(meeting: IFMeeting): Promise<void>{
        let MILLIS_PER_DAY = 86400000;

        // Loop while start time is less than until date
        while (1 == 1) {
            // clone a meeting from the meeting created with new start_time and end_time 
            const repeat_meeting = meeting.clone({
                start_time: meeting.start_time + MILLIS_PER_DAY,
                end_time: meeting.end_time + MILLIS_PER_DAY
            });
            repeat_meeting.setTime();

            if (repeat_meeting.start_time > meeting.until_date) break;
            repeat_meeting.save();

            this.notify({ meeting }, 'Repeat Meeting');

            // Add 1 day to MILLIS_PER_DAY (Loop to next day)
            MILLIS_PER_DAY += 86400000;
        }
    }

    /**
     * This function is used to create meetings that repeat by week
     * Loop while start time is less than until date
     * Each iteration will create a clone of @param meeting with new start_time and end_time
     */
    async createRepeatWeekly(meeting: IFMeeting): Promise<void>{
        let MILLIS_PER_WEEK = 604800000;

        // Loop while start time is less than until date
        while (1 == 1) {
            // clone a meeting from the meeting created with new start_time and end_time 
            const repeat_meeting = meeting.clone({
                start_time: meeting.start_time + MILLIS_PER_WEEK,
                end_time: meeting.end_time + MILLIS_PER_WEEK
            });
            repeat_meeting.setTime();

            if (repeat_meeting.start_time > meeting.until_date) break;
            repeat_meeting.save();

            this.notify({ meeting }, 'Repeat Meeting');

            // Add 1 week to MILLIS_PER_WEEK (loop to next week)
            MILLIS_PER_WEEK += 604800000;
        }
    }
    
    /**
     * This function is used to create meetings that repeat by month
     * Loop while start time is less than until date
     * Each iteration will create a clone of @param meeting with new start_time and end_time
     */
    async createRepeatMonthly(meeting: IFMeeting): Promise<void>{
        const start_time = new Date(meeting.start_time);
        const end_time = new Date(meeting.end_time);

        // Add 1 month to start time and end time
        start_time.setMonth(start_time.getMonth() + 1);
        end_time.setMonth(end_time.getMonth() + 1);

        // Loop while start time is less than until date
        while (1 == 1) {
            // clone a meeting from the meeting created with new start_time and end_time 
            const repeat_meeting = meeting.clone({
                start_time: start_time.getTime(),
                end_time: end_time.getTime()
            });
            repeat_meeting.setTime();

            if (repeat_meeting.start_time > meeting.until_date) break;
            meeting.save();

            this.notify({ meeting }, 'Repeat Meeting');

            // Add 1 month to start time and end time (loop to next month)
            start_time.setMonth(start_time.getMonth() + 1);
            end_time.setMonth(end_time.getMonth() + 1);
        }
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

        if(checkIfRoomAble) await checkIfRoomAble(meeting);

        await meeting.save();

        this.notify({meeting});

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

        Object.assign(meeting, meetingData);
        meeting.setTime();

        if(checkIfRoomAble) await checkIfRoomAble(meeting);

        await meeting.save();

        return meeting;
    }

    async deleteOne(filter?: any): Promise<IFMeeting> {
        const meeting: IFMeeting = await Meeting.findOneAndDelete(filter);
        if(!meeting) throw new HttpException({error_code: '404', error_message: 'Meeting not found'}, 404);

        return meeting;
    }
}