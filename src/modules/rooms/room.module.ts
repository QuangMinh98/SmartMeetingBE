import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomRepository } from './room.repository';
import { AuthMiddleware } from '../auth';

@Module({
    imports: [],
    controllers: [RoomController],
    providers: [RoomService, RoomRepository],
    exports: [RoomService, RoomRepository]
})
export class RoomModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(RoomController);
    }
}
