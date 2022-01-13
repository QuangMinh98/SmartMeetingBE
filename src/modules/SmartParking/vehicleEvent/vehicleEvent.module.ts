import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from '../../UserManagement/auth';
import { AuthTokenModule } from '../authToken';
import { VehicleEventController } from './vehicleEvent.controller';
import { VehicleEventService } from './vehicleEvent.service';

@Module({
    imports: [AuthTokenModule],
    controllers: [VehicleEventController],
    providers: [VehicleEventService],
    exports: [VehicleEventService]
})
export class VehicleEventModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(VehicleEventController);
    }
}
