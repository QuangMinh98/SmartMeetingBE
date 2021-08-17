import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { MeetingTypeController } from './meeting_types.controller';
import { MeetingTypeService } from "./meeting_types.service";
import { MeetingTypeRepository } from "./meeting_types.repository";
import { ResponseModule } from "../response"
import { AuthMiddleware } from '../auth'

@Module({
    imports: [ResponseModule],
    controllers: [MeetingTypeController],
    providers: [MeetingTypeService, MeetingTypeRepository],
    exports: [MeetingTypeService, MeetingTypeRepository]
})
export class MeetingTypeModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(MeetingTypeController);
    }
}