import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthMiddleware } from '../auth';
import { UserModule } from '../users';
import { FcmTokenController } from './fcm_token.controller';
import { FcmTokenService } from './fcm_token.service';

@Module({
    imports: [UserModule],
    controllers: [FcmTokenController],
    providers: [FcmTokenService],
    exports: [FcmTokenService]
})
export class FcmTokenModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(FcmTokenController);
    }
}