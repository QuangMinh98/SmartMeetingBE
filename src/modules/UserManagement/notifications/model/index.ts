import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { NotificationClass } from '../interface';

const NotificationSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId
    },
    data: {
        meeting_id: {
            type: Schema.Types.ObjectId
        }
    },
    read: {
        type: Boolean,
        default: false
    },
    created_time: {
        type: Number,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        expires: 2592000,
        default: Date.now
    }
});

NotificationSchema.index({ user: 1, created_time: -1 });

export const Notification = mongoose.model<NotificationClass>('Notification', NotificationSchema);
