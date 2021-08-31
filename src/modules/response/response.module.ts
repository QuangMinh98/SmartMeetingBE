import { Module } from '@nestjs/common'
import { ResponseRepository } from './response.repository'
import { ResponseService } from './response.service'

@Module({
    imports: [],
    providers: [ResponseRepository, ResponseService],
    exports: [ResponseRepository, ResponseService]
})
export class ResponseModule {}