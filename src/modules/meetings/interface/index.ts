import { Document } from 'mongoose'

export interface IFMeeting extends Document{
    _id: string,
    name: string,
    document?: string[],
    members: string[],
    description: string,
    notes: string,
    start_time: number,
    end_time: number,
    time: {
        start: number,
        end: number,
        date: number
    },
    remind?: boolean,
    repeat?: number,
    until_date?: number,
    clone?: boolean,
    clone_from?: string,
    day_of_week: number,
    number_of_members: number,
    room: string,
    user_booked: string,
    cestron_meeting_id?: string,
    type: string,
    created_time: number,
    updated_time: number
}