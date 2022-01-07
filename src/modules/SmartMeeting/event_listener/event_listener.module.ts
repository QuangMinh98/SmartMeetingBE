import { SmartMeetingNotificationModule } from '../smart_meeting_notifications';
import { CestronModule } from '../cestron/cestron.module';
import { Module } from '@nestjs/common';
import { EventListenerService } from './event_listener.service';

@Module({
    imports: [CestronModule, SmartMeetingNotificationModule],
    providers: [EventListenerService],
    exports: [EventListenerService]
})
export class EventListenerModule {}
