import { Global, Module } from '@nestjs/common';
import { ResponseRepository } from './response.repository';
import { ResponseService } from './response.service';

@Global()
@Module({
    imports: [],
    providers: [ResponseRepository, ResponseService],
    exports: [ResponseRepository, ResponseService]
})
export class ResponseModule {}