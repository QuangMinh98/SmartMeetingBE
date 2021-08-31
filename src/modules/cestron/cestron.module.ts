import { forwardRef, Module } from '@nestjs/common'
import { MeetingModule } from '../meetings'
import { MeetingTypeModule } from '../meeting_type'
import { RoomModule } from '../rooms'
import { CestronRepository } from './cestron.repository'
import { CestronService } from './cestron.service'

@Module({
    imports: [
        MeetingTypeModule,
        forwardRef(() => RoomModule)
    ],
    providers: [CestronRepository, CestronService],
    exports: [CestronRepository, CestronService]
})
export class CestronModule {}