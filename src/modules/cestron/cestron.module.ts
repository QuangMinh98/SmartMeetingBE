import { forwardRef, Module } from '@nestjs/common';
import { MeetingModule } from '../meetings';
import { MeetingTypeModule } from '../meeting_type';
import { RoomModule } from '../rooms';
import { CestronService } from './cestron.service';

@Module({
    imports: [MeetingTypeModule, forwardRef(() => RoomModule)],
    providers: [CestronService],
    exports: [CestronService]
})
export class CestronModule {}
