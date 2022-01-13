import { CacheModule, Module } from '@nestjs/common';
import { AuthTokenService } from './authToken.service';

@Module({
    imports: [CacheModule.register()],
    providers: [AuthTokenService],
    exports: [AuthTokenService]
})
export class AuthTokenModule {}
