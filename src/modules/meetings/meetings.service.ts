import { Injectable } from "@nestjs/common";
import { MeetingDto } from "./dto/dto";
import { MeetingRepository } from './meetings.repository'
import { CestronRepository } from '../cestron';
import { RoomRepository, IFRoom } from '../rooms'
import { MeetingTypeRepository, IFMeetingType } from '../meeting_type'
import { NotificationService } from "../notifications";
import { IFMeeting } from "./interface";

@Injectable()
export class MeetingService {

    constructor(
        private readonly meetingRepo: MeetingRepository,
        private readonly cestronRepo: CestronRepository,
        private readonly roomRepo: RoomRepository,
        private readonly meetingTypeRepo: MeetingTypeRepository,
        private readonly notificationService: NotificationService
    ) {}

    async createAppointmentsOnCestron(meeting: IFMeeting, room: IFRoom, meetingType: IFMeetingType){
        try{
            console.log('fail')
            meeting.cestron_meeting_id = await this.cestronRepo.createAppointments({
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
        // const room: IFRoom = await this.roomRepo.findById(meetingData.room)

        // const meetingType: IFMeetingType = await this.meetingTypeRepo.findById(meetingData.type)
        console.log(meetingData)

        const newMeeting = await this.meetingRepo.create(meetingData)
        
        // Create appointment on cestron thingworx
        //this.createAppointmentsOnCestron(newMeeting, room, meetingType)

        this.notificationService.createMany(newMeeting)

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

        return this.meetingRepo.getAll(filter)
    }

    getMeetingIBooked(id: string, { start_time, end_time }: { start_time?: number, end_time?: number}){
        let filter: any = { user_booked: id }
        if(start_time){
            filter.start_time = { $gte: start_time }
        }
        if(end_time){
            filter.end_time = { $lt: end_time }
        }

        return this.meetingRepo.getAll(filter)
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

    update(id: string, meetingData: MeetingDto, { isAdmin, userId }: { isAdmin?: boolean, userId: string }){
        let filter: any = { _id: id }

        // If user is not admin
        if(!isAdmin){
            filter.user_booked = userId
        }

        return this.meetingRepo.updateOne(meetingData, filter)
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