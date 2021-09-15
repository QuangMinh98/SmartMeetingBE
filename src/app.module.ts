import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth';
import { UserModule } from './modules/users';
import { RegisterModule } from './modules/register';
import { RoomModule } from './modules/rooms';
import { DeviceModule } from './modules/devices';
import { MeetingModule } from './modules/meetings';
import { MeetingTypeModule } from './modules/meeting_type';
import { NotificationModule } from './modules/notifications';
import { FcmTokenModule } from './modules/fcm_tokens';
import { ForgotPasswordModule } from './modules/forgot_password';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SharedModule } from './shared';
import { EventListenerModule } from './modules/event_listener';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        EventListenerModule,
        DatabaseModule,
        SharedModule,
        UserModule,
        AuthModule,
        RegisterModule,
        RoomModule,
        DeviceModule,
        MeetingModule,
        MeetingTypeModule,
        NotificationModule,
        FcmTokenModule,
        ForgotPasswordModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
