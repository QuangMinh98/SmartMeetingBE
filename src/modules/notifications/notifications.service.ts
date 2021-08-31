import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../firebase";
import { IFMeeting, MeetingObserver } from "../meetings";
import { RoomRepository } from "../rooms";
import { UserRepository } from "../users/users.repository";
import { NotificationRepository } from "./notifications.repository";

@Injectable()
export class NotificationService implements MeetingObserver {

    constructor(
        private readonly notificationRepo: NotificationRepository,
        private readonly userRepo: UserRepository,
        private readonly roomRepo: RoomRepository,
        private readonly firebaseService: FirebaseService,
    ) { }

    getAll({ page, limit }: { page?: number, limit?: number}, userId: string){
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.notificationRepo.findAllAndPaging({
            page, 
            limit,
            sort: { created_time: -1 }
        }, { user: userId })
    }


    async sendNotificationsToUser(userIds: string[], data){
        const users = await this.userRepo.findAll({ _id: { $in: userIds } })

        if(users.length > 0 ){
            let tokens = [];
            users.forEach(user => {
                tokens = tokens.concat(user.fcm_token)
            })
            if(tokens.length > 0) this.firebaseService.sendNotifications(tokens, data)
        }
    }

    async observerNotify(meeting: IFMeeting){
        await this.createMany(meeting)
    }

    async createMany(meeting: IFMeeting){
        let noti = []
        
        const user_booked = await this.userRepo.findById(meeting.user_booked)

        const room = await this.roomRepo.findById(meeting.room)

        const body = `${ user_booked.fullname } invite you to join ${ meeting.name} at ${room.name} dated ${(new Date(meeting.start_time)).toLocaleDateString('vi-VN',{timeZone: "Asia/Ho_Chi_Minh"})} ${(new Date(meeting.start_time)).toLocaleTimeString('vi-VN',{timeZone: "Asia/Ho_Chi_Minh"})} - ${(new Date(meeting.end_time)).toLocaleTimeString('vi-VN',{timeZone: "Asia/Ho_Chi_Minh"})}` 
        
        const data = {
            title: "Meeting",
            body,
            data: {
                meeting_id: meeting._id
            }
        }

        // Send firebase message to user's device
        this.sendNotificationsToUser(meeting.members, data)
        
        meeting.members.forEach(user => {
            noti.push({
                ...data,
                user,
                created_time: Date.now()
            })
        })

        if(noti.length > 0){
            await this.notificationRepo.insertMany(noti)
        }
    }

}