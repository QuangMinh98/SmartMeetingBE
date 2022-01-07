import { Module } from '@nestjs/common';
import { CestronModule } from './cestron';
import { DeviceModule } from './devices';
import { EventListenerModule } from './event_listener';
import { MeetingModule } from './meetings';
import { MeetingTypeModule } from './meeting_type';
import { SmartMeetingNotificationModule } from './smart_meeting_notifications';
import { RoomModule } from './rooms';

@Module({
    imports: [
        RoomModule,
        DeviceModule,
        MeetingModule,
        MeetingTypeModule,
        SmartMeetingNotificationModule,
        CestronModule,
        EventListenerModule
    ],
    providers: [],
    exports: []
})
export class SmartMeetingModule {}
