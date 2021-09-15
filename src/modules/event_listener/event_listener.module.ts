import { NotificationModule } from './../notifications/notifications.module';
import { CestronModule } from './../cestron/cestron.module';
import { Module } from '@nestjs/common';
import { EventListenerService } from './event_listener.service';

@Module({
    imports: [CestronModule, NotificationModule],
    providers: [EventListenerService],
    exports: [EventListenerService]
})
export class EventListenerModule {}
