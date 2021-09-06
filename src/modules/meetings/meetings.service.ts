import { HttpException, Injectable } from "@nestjs/common";
import { MeetingDto } from "./dto/dto";
import { MeetingRepository } from './meetings.repository'
import { CestronService } from '../cestron';
import { NotificationService } from "../notifications";
import { IFMeeting } from "./interface";

@Injectable()
export class MeetingService {

    constructor(
        private readonly meetingRepo: MeetingRepository,
        private readonly cestronService: CestronService,
        private readonly notificationService: NotificationService
    ) {
        // Attach observers to the meeting subject.
        this.meetingRepo.attach(this.notificationService)
        this.meetingRepo.attach(this.cestronService)
    }

    /**
     * This function used to create data filter for check if the time of this meeting is overlapped with another meeting
     */
    filterMeeting(meeting: IFMeeting){
        // Filter data object
        let filter: any = {
            room: meeting.room,
            start_time: { $lte: meeting.end_time, $gte: meeting.start_time }, // Find a meeting that start_time of this meeting  
            _id: { $ne: meeting._id },
            $or: [
                { 'time.start': {$gte: meeting.time.start , $lte: meeting.time.end} },
                { 'time.end': {$gte: meeting.time.start, $lte: meeting.time.end} }
            ]
        }

        // If meeting is not repeat
        if(!meeting.repeat || meeting.repeat === 0){
            filter = {
                room: meeting.room,
                $or: [
                    { start_time: { $gte: meeting.start_time, $lte: meeting.end_time } },
                    { end_time: { $gte: meeting.start_time, $lte: meeting.end_time} }
                ]
            }
        }

        // If repeat is weekly
        if(meeting.repeat === 2){
            filter.day_of_week = meeting.day_of_week
        }

        // If repeat is monthly
        if(meeting.repeat === 3){
            filter["time.date"] = meeting.time.date
        }
        return filter
    }

    /**
     * Check the number of duplicate meetings with @param meeting
     */
    async checkIfRoomAble(meeting: IFMeeting){
        let filter = this.filterMeeting(meeting)

        // Get data from database
        const meetings = await this.meetingRepo.countDocuments(filter);
        return meetings
    }

    async checkingRoomWhenUpdate(meeting: IFMeeting) {
        let filter = {
            "room": meeting.room,
            "_id": { $ne: meeting._id },
            "$or": [
                { 'start_time': { $gte: meeting.start_time, $lte: meeting.end_time } },
                { 'end_time': { $gte: meeting.start_time, $lte: meeting.end_time } }
            ]
        }

        // Get data from database
        const meetings = await this.meetingRepo.countDocuments(filter)

        return meetings
    }

    async create(meetingData: MeetingDto){

        const newMeeting = await this.meetingRepo.create(meetingData, async (meeting) => {
            // Check if there is a meeting created at this time before save new meeting to database
            if(await this.checkIfRoomAble(meeting) > 0) 
            throw new HttpException({error_code: "400", error_message: "Can not booking meeting."}, 400)
        })

        return newMeeting;
    }

    getByRoom(id: string){
        return this.meetingRepo.getByRoom(id)
    }

    getMyMeeting(id: string, { start_time, end_time }: { start_time?: number, end_time?: number}){
        let filter: any = {
            $or: [
                { members: { $in:  [id] } }, // if this user is a member of this meetings
                { user_booked: id } // or if this user is the user who created this meeting
            ]
        }
        if(start_time){
            filter.start_time = { $gte: start_time }
        }
        if(end_time){
            filter.end_time = { $lt: end_time }
        }

        return this.meetingRepo.getAllAndGroupByDate(filter)
    }

    getMeetingIBooked(id: string, { start_time, end_time }: { start_time?: number, end_time?: number}){
        let filter: any = { user_booked: id }

        if(start_time){
            filter.start_time = { $gte: start_time }
        }
        if(end_time){
            filter.end_time = { $lt: end_time }
        }

        return this.meetingRepo.getAllAndGroupByDate(filter)
    }

    getById(id: string, { isAdmin, userId }: { isAdmin: boolean, userId: string }){
        let filter: any = { _id: id }

        // If the user does not have administrative rights,
        // he or she is only allowed to view information about meetings booked by himself or as a member who can join that meeting.
        if(!isAdmin){
            filter.$or = [
                {user_booked: userId},
                {members: { $in: userId }}
            ]
        }

        return this.meetingRepo.getOne(filter)
    }

    async update(id: string, meetingData: MeetingDto, { isAdmin, userId }: { isAdmin?: boolean, userId: string }){
        let filter: any = { _id: id }

        // If the user does not have administrative rights,
        // he is only allowed to view the meeting information book by himself
        if(!isAdmin){
            filter.user_booked = userId
        }

        const updated_meeting = await this.meetingRepo.updateOne(meetingData, filter, async (meeting) => {
            // Check if there is a meeting created at this time
            if(await this.checkingRoomWhenUpdate(meeting) > 0) 
            throw new HttpException({error_code: "400", error_message: "Can not update meeting."}, 400)
        })

        await updated_meeting.save()

        return updated_meeting
    }

    delete(id: string, { isAdmin, userId }: { isAdmin: boolean, userId: string}){
        let filter: any = { _id: id }

        // If the user does not have administrative rights,
        // he is only allowed to view the meeting information book by himself
        if(!isAdmin){
            filter.user_booked = userId
        }

        return this.meetingRepo.deleteOne(filter)
    }

}