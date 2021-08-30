import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AuthMiddleware } from "../auth";
import { FirebaseModule } from "../firebase";
import { ResponseModule } from "../response";
import { RoomModule } from "../rooms";
import { UserModule } from "../users";
import { NotificationController } from "./notifications.controller";
import { NotificationRepository } from "./notifications.repository";
import { NotificationService } from "./notifications.service";

@Module({
    imports: [UserModule, RoomModule, FirebaseModule, ResponseModule],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository],
    exports: [NotificationService, NotificationRepository]
})
export class NotificationModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(NotificationController);
      }
}