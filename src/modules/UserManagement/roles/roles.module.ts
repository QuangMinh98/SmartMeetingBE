import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from '../auth';
import { RoleService } from './roles.service';
import { RoleRepository } from './roles.repository';
import { RoleController } from './roles.controller';

@Module({
    imports: [],
    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService, RoleRepository]
})
export class RoleModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(RoleController);
    }
}
