import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from '../../UserManagement/auth';
import { NotificationController } from './notifications.controller';
import { NotificationRepository } from './notifications.repository';
import { NotificationService } from './notifications.service';

@Module({
    imports: [],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository],
    exports: [NotificationService, NotificationRepository]
})
export class NotificationModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(NotificationController);
    }
}
