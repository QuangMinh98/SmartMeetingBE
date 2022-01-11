import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SharedModule } from './shared';
import { SmartMeetingModule } from './modules/SmartMeeting';
import { UserManagementModule } from './modules/UserManagement';
import { SmartParkingModule } from './modules/SmartParking';

@Module({
    imports: [
        ConfigModule,
        EventEmitterModule.forRoot(),
        SharedModule,
        DatabaseModule,
        UserManagementModule,
        SmartMeetingModule,
        SmartParkingModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
