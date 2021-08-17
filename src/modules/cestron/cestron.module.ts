import { Module } from '@nestjs/common'
import { CestronRepository } from './cestron.repository'

@Module({
    imports: [],
    providers: [CestronRepository],
    exports: [CestronRepository]
})
export class CestronModule {}