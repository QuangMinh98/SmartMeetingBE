import { Module } from '@nestjs/common';
import { RoomModule } from '../rooms';
import { SmartMeetingNotificationService } from './smart_meeting_notifications.service';
import { NotificationModule } from 'src/modules/UserManagement';

@Module({
    imports: [RoomModule, NotificationModule],
    controllers: [],
    providers: [SmartMeetingNotificationService],
    exports: [SmartMeetingNotificationService]
})
export class SmartMeetingNotificationModule {}
