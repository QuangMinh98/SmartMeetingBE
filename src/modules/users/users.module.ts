import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './users.controller';
import { AuthMiddleware } from '../auth';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { RoleMiddleware } from '../roles/roles.middleware';

@Global()
@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository]
})
export class UserModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(UserController);
        consumer
            .apply(RoleMiddleware('UserManagement'))
            .exclude(
                { path: '/api/users/me', method: RequestMethod.ALL },
                { path: '/api/users', method: RequestMethod.GET }
            )
            .forRoutes(UserController);
    }
}
