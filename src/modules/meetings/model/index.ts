import * as mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { IFMeeting } from '../interface'

const MeetingSchema = new Schema({
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

export const Meeting = mongoose.model<IFMeeting>('Meeting', MeetingSchema)