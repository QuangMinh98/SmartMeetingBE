import { Document } from 'mongoose';

export interface IFNotification {
    title: string;
    body: string;
    user: string;
    data: { meeting_id: string };
    read: boolean;
}

export class NotificationClass extends Document implements IFNotification {
    title: string;
    body: string;
    user: string;
    data: { meeting_id: string };
    read: boolean;
}
