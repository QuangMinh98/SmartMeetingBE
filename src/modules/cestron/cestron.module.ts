import { Module } from '@nestjs/common'
import { CestronRepository } from './cestron.repository'
import { CestronService } from './cestron.service'

@Module({
    imports: [],
    providers: [CestronRepository, CestronService],
    exports: [CestronRepository, CestronService]
})
export class CestronModule {}