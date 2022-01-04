import { Module } from '@nestjs/common';
import { CestronModule } from './cestron';
import { DeviceModule } from './devices';
import { EventListenerModule } from './event_listener';
import { MeetingModule } from './meetings';
import { MeetingTypeModule } from './meeting_type';
import { NotificationModule } from './notifications';
import { RoomModule } from './rooms';

@Module({
    imports: [
        RoomModule,
        DeviceModule,
        MeetingModule,
        MeetingTypeModule,
        NotificationModule,
        CestronModule,
        EventListenerModule
    ],
    providers: [],
    exports: []
})
export class SmartMeetingModule {}
