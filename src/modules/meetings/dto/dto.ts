import { IsNotEmpty } from 'class-validator';

export class MeetingDto {

    @IsNotEmpty()
    readonly name: string;

    document?: string[];

    readonly members: string[];

    readonly description: string;
    
    readonly note: string;
    
    @IsNotEmpty()
    readonly start_time: number;
    
    @IsNotEmpty()
    readonly end_time: number;
    
    readonly remind?: boolean;
    
    readonly repeat?: number;
    
    readonly until_date?: number;
    
    readonly number_of_members: number;
    
    @IsNotEmpty()
    readonly room: string;
    
    readonly type: string;

    user_booked?: string;

    cestron_meeting_id: string;
}