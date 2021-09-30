import { Injectable } from '@nestjs/common';
import { FirebaseService, HelperService } from 'src/shared';
import { IFMeeting } from '../meetings';
import { ISubscription } from '../observer';
import { RoomRepository } from '../rooms';
import { UserRepository } from '../users/users.repository';
import { NotificationRepository } from './notifications.repository';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepo: NotificationRepository,
        private readonly userRepo: UserRepository,
        private readonly roomRepo: RoomRepository,
        private readonly firebaseService: FirebaseService,
        private readonly helperService: HelperService
    ) {}

    getAll({ page, limit }: { page?: number; limit?: number }, userId: string) {
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.notificationRepo.findAllAndPaging(
            {
                page,
                limit,
                sort: { created_time: -1 }
            },
            { user: userId }
        );
    }

    async observerNotify({ meeting, old_meeting }: ISubscription, type?: string) {
        if (!type || type === 'Create Meeting') await this.createMany(meeting);
        if (type === 'Update Meeting') await this.createNotificationWhenUpdate(meeting, old_meeting);
    }

    /**
     * This function used to send firebase notifications to members's devices
     */
    async sendNotificationsToUser(userIds: string[], data) {
        const users = await this.userRepo.findAll({ _id: { $in: userIds } });

        // Get list tokens from users and send firebase notifications by that tokens
        if (users.length > 0) {
            let tokens = [];
            users.forEach((user) => {
                tokens = tokens.concat(user.fcm_token);
            });
            if (tokens.length > 0) this.firebaseService.sendNotifications(tokens, data);
        }
    }

    /**
     * This function used to create notifications and save it to database
     * then send firebase notifications to users'device
     * Find user_booked's data and room's data, then use those data to create notification body
     * Loop members'ids and create new notifications data
     */
    async createMany(meeting: IFMeeting) {
        const listNotis = [];

        const userBooked = await this.userRepo.findById(meeting.user_booked);
        const room = await this.roomRepo.findById(meeting.room);
        const body = `${userBooked.fullname} invite you to join ${meeting.name} at ${
            room.name
        } dated ${this.helperService.startTimeAndEndTimeToString(meeting.start_time, meeting.end_time)}`;

        // Data to create notifications
        const data = {
            title: 'Smart Meeting',
            body,
            data: {
                meeting_id: meeting._id
            }
        };

        // Send firebase message to users's devices
        this.sendNotificationsToUser(meeting.members, data);

        // Create a new notifications data and push it to list_notis
        meeting.members.forEach((user) => {
            listNotis.push({
                ...data,
                user,
                created_time: Date.now()
            });
        });

        if (listNotis.length > 0) {
            await this.notificationRepo.insertMany(listNotis);
        }
    }

    /**
     * This function used to create notifications and save it to database when update meeting data,
     * then send a firebase message to the old members with the content that the meeting information has been updated and
     * send a firebase message to the new members with the content of inviting to join the meeting,
     * then check the information that has changed and create the message body corresponding to those changes.
     * Find user_booked's data and room's data, then use those data to create notification body
     * Loop members'ids and create new notifications data
     * @param meeting: TInformation of the meeting after it has been successfully updated
     * @param old_meeting : Information of the meeting before being changed
     */
    async createNotificationWhenUpdate(meeting: IFMeeting, old_meeting: IFMeeting) {
        const modifieldPath: string[] = meeting.directModifiedPaths();

        if (modifieldPath.length > 0) {
            // if members have been updated then send a firebase message to the new members with the content of inviting to join the meeting
            if (modifieldPath.includes('members')) this.createNotificationForNewUser(meeting, old_meeting);
            // Check the information that has changed and create the message body corresponding to those changes
            if (modifieldPath.includes('start_time') || modifieldPath.includes('end_time')) {
                let body = `The meeting ${old_meeting.name} has been updated`;
                body += ` from ${this.helperService.startTimeAndEndTimeToString(
                    old_meeting.start_time,
                    old_meeting.end_time
                )} to ${this.helperService.startTimeAndEndTimeToString(meeting.start_time, meeting.end_time)}`;
                // Data to create notifications
                const data = {
                    title: 'Meeting has been updated',
                    body,
                    data: {
                        meeting_id: meeting._id
                    }
                };
                const clone = meeting.clone({
                    members: meeting.members.filter((member) => old_meeting.members.includes(member))
                });
                // Create a new notifications data and push it to list_notis
                const listNotis = clone.members.map((user) => {
                    return {
                        ...data,
                        user,
                        created_time: Date.now()
                    };
                });
                // Send firebase message to users's devices
                this.sendNotificationsToUser(clone.members, data);
                if (listNotis.length > 0) await this.notificationRepo.insertMany(listNotis);
            }
        }
    }

    async createNotificationForNewUser(meeting: IFMeeting, old_meeting: IFMeeting) {
        const clone = meeting.clone({
            members: meeting.members.filter((member) => !old_meeting.members.includes(member))
        });
        if (clone.members.length > 0) this.createMany(clone);
    }
}
