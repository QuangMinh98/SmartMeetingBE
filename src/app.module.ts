import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth';
import { UserModule } from './modules/users';
import { RegisterModule } from './modules/register';
import { RoomModule } from './modules/rooms';
import { LocationModule } from './modules/locations';
import { DeviceModule } from './modules/devices';
import { MeetingModule } from './modules/meetings';
import { MeetingTypeModule } from './modules/meeting_type';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    RegisterModule,
    RoomModule,
    LocationModule,
    DeviceModule,
    MeetingModule,
    MeetingTypeModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
