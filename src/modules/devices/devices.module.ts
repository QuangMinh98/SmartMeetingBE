import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DeviceService } from './devices.service';
import { DeviceRepository } from './devices.repository';
import { DeviceController } from './devices.controller';
import { RoomModule } from '../rooms';
import { ResponseModule } from '../response';
import { AuthMiddleware } from '../auth';
import { CestronModule } from '../cestron';

@Module({
    imports: [RoomModule, ResponseModule, CestronModule],
    controllers: [DeviceController],
    providers: [DeviceService, DeviceRepository],
    exports: [DeviceService, DeviceRepository]
})
export class DeviceModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(DeviceController);
    }
}