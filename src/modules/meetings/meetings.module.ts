import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '../auth';
import { RoomModule } from '../rooms';
import { MeetingController } from './meetings.controller';
import { MeetingService } from './meetings.service';
import { MeetingRepository } from './meetings.repository';
import { MeetingTypeModule } from '../meeting_type';
import { CestronModule } from '../cestron';
import { NotificationModule } from '../notifications';

@Module({
    imports: [RoomModule, CestronModule, MeetingTypeModule, NotificationModule],
    controllers: [MeetingController],
    providers: [MeetingService, MeetingRepository],
    exports: [MeetingService, MeetingRepository]
})
export class MeetingModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(MeetingController);
    }
}
