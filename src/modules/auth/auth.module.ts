import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService, AuthMiddleware],
    exports: [AuthService, AuthMiddleware]
})
export class AuthModule {}
