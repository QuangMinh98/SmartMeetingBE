import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase';
import { IFMeeting } from '../meetings';
import { ISubscription, Observer } from '../observer';
import { RoomRepository } from '../rooms';
import { UserRepository } from '../users/users.repository';
import { NotificationRepository } from './notifications.repository';

@Injectable()
export class NotificationService implements Observer {

    constructor(
        private readonly notificationRepo: NotificationRepository,
        private readonly userRepo: UserRepository,
        private readonly roomRepo: RoomRepository,
        private readonly firebaseService: FirebaseService,
    ) {}

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
        }, { user: userId });
    }

    /**
     * This function used to send firebase notifications to members's devices
     */
    async sendNotificationsToUser(userIds: string[], data){
        const users = await this.userRepo.findAll({ _id: { $in: userIds } });

        // Get list tokens from users and send firebase notifications by that tokens
        if(users.length > 0 ){
            let tokens = [];
            users.forEach(user => {
                tokens = tokens.concat(user.fcm_token);
            });
            if(tokens.length > 0) this.firebaseService.sendNotifications(tokens, data);
        }
    }

    async observerNotify({ meeting }: ISubscription, type?: string){
        if(!type || type === 'Create Meeting')  await this.createMany(meeting);
    }

    /**
     * This function used to create notifications and save it to database
     * then send firebase notifications to users'device
     * Find user_booked's data and room's data, then use those data to create notification body
     * Loop members'ids and create new notifications data
     */
    async createMany(meeting: IFMeeting){
        const list_notis = [];
        
        const user_booked = await this.userRepo.findById(meeting.user_booked);
        const room = await this.roomRepo.findById(meeting.room);
        const body = `${ user_booked.fullname } invite you to join ${ meeting.name} at ${room.name} dated ${(new Date(meeting.start_time)).toLocaleDateString('vi-VN',{timeZone: 'Asia/Ho_Chi_Minh'})} ${(new Date(meeting.start_time)).toLocaleTimeString('vi-VN',{timeZone: 'Asia/Ho_Chi_Minh'})} - ${(new Date(meeting.end_time)).toLocaleTimeString('vi-VN',{timeZone: 'Asia/Ho_Chi_Minh'})}`; 
        
        // Data to create notifications
        const data = {
            title: 'Meeting',
            body,
            data: {
                meeting_id: meeting._id
            }
        };

        // Send firebase message to users's devices
        this.sendNotificationsToUser(meeting.members, data);
        
        // Create a new notifications data and push it to list_notis
        meeting.members.forEach(user => {
            list_notis.push({
                ...data,
                user,
                created_time: Date.now()
            });
        });

        if(list_notis.length > 0){
            await this.notificationRepo.insertMany(list_notis);
        }
    }

    // async createManyUpdateNotification(meeting: IFMeeting, clone_meeting?: IFMeeting){
    //     let noti = []
    //     let changed_data: any = {
    //         name: (clone_meeting.name !== meeting.name) ? meeting.name : undefined,
    //         start_time: (clone_meeting.start_time !== meeting.start_time) ? meeting.start_time : undefined,
    //         end_time: (clone_meeting.end_time !== meeting.end_time) ? meeting.end_time : undefined,
    //         members: meeting.members.filter(member =>  clone_meeting.members.includes(member)),
    //         new_members: meeting.members.filter(member =>  !clone_meeting.members.includes(member))
    //     }

    //     let body = `The meeting ${meeting.name} has been updated to `
    //     if(changed_data.name || changed_data.start_time || changed_data.end_time){
    //         if(changed_data.name) body += `name ${changed_data.name} `
    //         if(changed_data.start_time) body += `start at ${changed_data.start_time} `
    //         if(changed_data.end_time) body += `end at ${changed_data.end_time} `
    //     }

    //     const data = {
    //         title: 'Meeting has been updated',
    //         body,
    //         data: {
    //             meeting_id: meeting._id
    //         }
    //     }

    //     this.sendNotificationsToUser(meeting.members, data)

    //     changed_data.members.forEach(user => {
    //         noti.push({
    //             ...data,
    //             user,
    //             created_time: Date.now()
    //         })
    //     })

    //     if(noti.length > 0){
    //         await this.notificationRepo.insertMany(noti)
    //     }

    //     if(changed_data.members.length > 0) this.createMany(meeting.clone({ members: changed_data.new_members }))


    // }

}