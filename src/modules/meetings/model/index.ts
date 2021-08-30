import * as mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { IFMeeting, MeetingModel } from '../interface'

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
            ref: "User"
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
    clone: {
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
        ref: "MeetingType"
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
})

MeetingSchema.statics.findAndGroupByDate = function (filter?: any): Array<IFMeeting[]>{
    const meetings = this.find(filter)
        .populate('room')
        .populate('type')
        .sort({ start_time: 'desc' })

    let intermediary = 0;
    let result: Array<IFMeeting[]> = [];
    let group_meetings: IFMeeting[] = [];

    meetings.forEach(meeting => {
        let surplus = Math.floor(meeting.start_time / 86400000)
        if (intermediary === surplus) group_meetings.push(meeting)
        else {
            if (group_meetings.length > 0) result.push(group_meetings)
            group_meetings = [meeting]
        }
        intermediary = surplus
    })
    result.push(group_meetings)

    return result
}

MeetingSchema.methods.setTime = function(){
    this.day_of_week = (new Date(this.start_time)).getDay()
    this.time = {
        start: (this.start_time + 25200000) % 86400000,
        end: (this.end_time + 25200000) % 86400000,
        date: (new Date(this.start_time)).getDate()
    }
}

// Protoptype design pattern
MeetingSchema.methods.clone = function(properties?: any): IFMeeting{
    const clone = new (mongoose.model<IFMeeting>('Meeting', MeetingSchema))({
        ...this,
        ...properties,
        _id: undefined
    })
    clone.setTime()

    return clone
}

export const Meeting = mongoose.model<IFMeeting, MeetingModel>('Meeting', MeetingSchema)