import { Module } from '@nestjs/common';
import { MeetingTypeModule } from '../meeting_type';
import { RoomModule } from '../rooms';
import { CestronService } from './cestron.service';

@Module({
    imports: [MeetingTypeModule, RoomModule],
    providers: [CestronService],
    exports: [CestronService]
})
export class CestronModule {}
