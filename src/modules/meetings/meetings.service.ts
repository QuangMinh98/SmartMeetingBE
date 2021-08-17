import { Injectable } from "@nestjs/common";
import { MeetingDto } from "./dto/dto";
import { MeetingRepository } from './meetings.repository'
import { CestronRepository } from '../cestron';
import { RoomRepository, IFRoom } from '../rooms'
import { MeetingTypeRepository, IFMeetingType } from '../meeting_type'

@Injectable()
export class MeetingService {

    constructor(
        private readonly meetingRepo: MeetingRepository,
        private readonly cestronRepo: CestronRepository,
        private readonly roomRepo: RoomRepository,
        private readonly meetingTypeRepo: MeetingTypeRepository
    ) {}

    async create(meetingData: MeetingDto){
        const room: IFRoom = await this.roomRepo.findById(meetingData.room)

        const meetingType: IFMeetingType = await this.meetingTypeRepo.findById(meetingData.type)
        // Create appointment on cestron thingworx
        try{
            meetingData.cestron_meeting_id = await this.cestronRepo.createAppointments({
                cestron_room_id: room.cestron_room_id,
                name: meetingData.name,
                note: meetingData.note,
                start_time: meetingData.start_time,
                end_time: meetingData.end_time,
                type_id: meetingType.cestron_action_id,
                type_name: meetingType.name
            })
        }
        catch(err){
            console.log(err.message);
        }
        return this.meetingRepo.create(meetingData)        
    }

    getByRoom(id: string){
        return this.meetingRepo.getByRoom(id)
    }

    getByUser(id: string, { start_time, end_time }: { start_time?: number, end_time?: number}){
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