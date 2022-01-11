import { Module } from '@nestjs/common';
import { AuthTokenService } from './authToken.service';

@Module({
    imports: [],
    providers: [AuthTokenService],
    exports: [AuthTokenService]
})
export class AuthTokenModule {}
