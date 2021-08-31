import { HttpException, Injectable } from "@nestjs/common";
import { MeetingDto } from "./dto/dto";
import { MeetingRepository } from './meetings.repository'
import { CestronRepository, CestronService } from '../cestron';
import { RoomRepository, IFRoom } from '../rooms'
import { MeetingTypeRepository, IFMeetingType } from '../meeting_type'
import { NotificationService } from "../notifications";
import { IFMeeting } from "./interface";

@Injectable()
export class MeetingService {

    constructor(
        private readonly meetingRepo: MeetingRepository,
        private readonly roomRepo: RoomRepository,
        private readonly meetingTypeRepo: MeetingTypeRepository,
        private readonly cestronService: CestronService,
        private readonly notificationService: NotificationService
    ) {
        this.meetingRepo.attach(this.notificationService)
    }

    filterMeeting(meeting: IFMeeting){
        // Filter data object
        let filter: any = {
            "room": meeting.room,
            "start_time": { $lte: meeting.until_date, $gte: meeting.start_time },
            "_id": { "$ne": meeting._id },
            "$or": [
                { 'time.start': {$gte: meeting.time.start , $lte: meeting.time.end} },
                { 'time.end': {$gte: meeting.time.start, $lte: meeting.time.end} }
            ]
        }

        // If meeting is not repeat
        if(!meeting.repeat || meeting.repeat === 0){
            filter = {
                "room": meeting.room,
                "$or": [
                    { 'start_time': { $gte: meeting.start_time, $lte: meeting.end_time } },
                    { 'end_time': { $gte: meeting.start_time, $lte: meeting.end_time} }
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

    async createAppointmentsOnCestron(meeting: IFMeeting){
        try{
            const room: IFRoom = await this.roomRepo.findById(meeting.room)

            const meetingType: IFMeetingType = await this.meetingTypeRepo.findById(meeting.type)
            meeting.cestron_meeting_id = await this.cestronService.createAppointments({
                cestron_room_id: room.cestron_room_id,
                name: meeting.name,
                note: meeting.note,
                start_time: meeting.start_time,
                end_time: meeting.end_time,
                type_id: meetingType.cestron_action_id,
                type_name: meetingType.name
            })

            meeting.save()
        }
        catch(err){
            console.log(err.message);
        }
    }

    async create(meetingData: MeetingDto){

        const newMeeting = await this.meetingRepo.create(meetingData, async (meeting) => {
            // Check if there is a meeting created at this time
            if(await this.checkIfRoomAble(meeting) > 0) 
            throw new HttpException({error_code: "400", error_message: "Can not booking meeting."}, 400)
        })

        // Create appointment on cestron thingworx
        this.createAppointmentsOnCestron(newMeeting)

        return newMeeting;
    }

    getByRoom(id: string){
        return this.meetingRepo.getByRoom(id)
    }

    getMyMeeting(id: string, { start_time, end_time }: { start_time?: number, end_time?: number}){
        let filter: any = {
            $or: [
                { members: { $in:  [id] } },
                { user_booked: id }
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

        // If user is not admin
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

        // If user is not admin
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

        // If user is not admin
        if(!isAdmin){
            filter.user_booked = userId
        }

        return this.meetingRepo.deleteOne(filter)
    }

}