import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from '../../UserManagement/auth';
import { AuthTokenModule } from '../authToken';
import { EmptySlotController } from './emptySlot.controller';
import { EmptySlotService } from './emptySlot.service';

@Module({
    imports: [AuthTokenModule],
    controllers: [EmptySlotController],
    providers: [EmptySlotService],
    exports: [EmptySlotService]
})
export class EmptySlotModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(EmptySlotController);
    }
}
