import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IFMeeting, MeetingModel } from '../interface';

const MeetingSchema = new Schema<IFMeeting>({
    name: {
        type: String
    },
    documents: [
        {
            type: String
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    description: {
        type: String
    },
    note: {
        type: String
    },
    start_time: {
        type: Number
    },
    end_time: {
        type: Number
    },
    time: {
        start: { type: Number },
        end: { type: Number },
        date: { type: Number }
    },
    remind: {
        type: Boolean,
        default: false
    },
    repeat: {
        type: Number
    },
    until_date: {
        type: Number
    },
    isClone: {
        type: Boolean
    },
    clone_from: {
        type: Schema.Types.ObjectId
    },
    day_of_week: {
        type: Number
    },
    number_of_members: {
        type: Number
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    user_booked: {
        type: Schema.Types.ObjectId
    },
    cestron_meeting_id: {
        type: String
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'MeetingType'
    },
    user_updated: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_time: {
        type: Number,
        default: Date.now(),
        immutable: true
    },
    updated_time: {
        type: Number,
        default: Date.now()
    }
});

MeetingSchema.index({ room: 1, start_time: -1, end_time: -1 });
MeetingSchema.index({ user_booked: 1, start_time: -1, end_time: -1 });
MeetingSchema.index({ user_booked: 1, start_time: -1, end_time: -1, members: 1 });
MeetingSchema.index({ members: 1 });
MeetingSchema.index({ user_booked: 1 });
MeetingSchema.index({ start_time: -1 });

/**
 * This function used to get all meetings sort by start_time and group them by date
 * Get all meetings, then create a group_meetings variable to hold meetings on the same day and a intermediary variable
 * Loop all meetings found, if surplus when dividing start_time by the number of milliseconds per day
 * equal to intermediary variable (in the same day), then push that meeting to the group_meetings variable 
 * if not equal, than clear the group_meetings variable and push that meeting to the group_meetings variable 
 * Then change intermediary variable to be same as surplus variable
 * 
 * @param filter 
 * @returns 
 */
MeetingSchema.statics.findAndGroupByDate = async function (filter?: Object): Promise<Array<IFMeeting[]>>{
    const VIET_NAM_UTC = 25200000;
    const MILLIS_PER_DAY = 86400000;

    const meetings = await this.find(filter)
        .populate('room')
        .populate('type')
        .sort({ start_time: 'desc' });

    let intermediary = 0;
    const result: Array<IFMeeting[]> = [];
    let group_meetings: IFMeeting[] = [];

    meetings.forEach(meeting => {
        // if surlus equal to surplus when dividing start_time by the number of milliseconds per day
        // it means this meeting in a same day as meetings in group_meetings variable
        // Add start_time with VIET_NAM_UTC because timezone is +7
        const surplus = Math.floor((meeting.start_time + VIET_NAM_UTC) /MILLIS_PER_DAY);
        if(intermediary === surplus) group_meetings.push(meeting);
        else{
            // If not equal it means this meeting not in a same day as meetings in group_meetings variable
            // then push old group_meetings variable to result and clear group_meetings variable
            if(group_meetings.length > 0) result.push(group_meetings);
            group_meetings = [ meeting ];
        }
        intermediary = surplus;
    });
    result.push(group_meetings);

    return result;
};

/**
 * This function to set hour data (seconds since 00:00 to start_time) and end data (seconds since 00:00:00 to end_time)
 * set day_of_week by start_time data
 * This properties used to checking if the time of this meeting is overlapped with another meeting
 */
MeetingSchema.methods.setTime = function(){
    const VIET_NAM_UTC = 25200000; // Vietnam is 7 hours different from the original time zone
    const MILLIS_PER_DAY = 86400000;
    this.day_of_week = (new Date(this.start_time +  VIET_NAM_UTC)).getDay();
    this.time = {
        start: (this.start_time +  VIET_NAM_UTC) % MILLIS_PER_DAY,
        end: (this.end_time +  VIET_NAM_UTC) % MILLIS_PER_DAY,
        date: (new Date(this.start_time +  VIET_NAM_UTC)).getDate()
    };
};

// Protoptype design pattern
MeetingSchema.methods.clone = function(properties?: any): IFMeeting{
    const clone = new (mongoose.model<IFMeeting>('Meeting', MeetingSchema))({
        ...this.toObject(),
        ...properties,
        _id: undefined,
        clone_from: this._id
    });
    clone.setTime();

    return clone;
};

export const Meeting = mongoose.model<IFMeeting, MeetingModel>('Meeting', MeetingSchema);