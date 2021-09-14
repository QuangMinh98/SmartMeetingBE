import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { UserController } from './users.controller';
import { AuthMiddleware } from '../auth';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';

@Module({
    imports: [],
    controllers:[UserController],
    providers: [
        UserService,
        UserRepository
    ],
    exports: [
        UserService,
        UserRepository
    ]
})
export class UserModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(UserController);
      }
}