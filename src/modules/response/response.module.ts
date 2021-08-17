import { Module } from '@nestjs/common'
import { ResponseRepository } from './response.repository'

@Module({
    imports: [],
    providers: [ResponseRepository],
    exports: [ResponseRepository]
})
export class ResponseModule {}