import {
    Module,
    MiddlewareConsumer,
    NestModule,
    RequestMethod
} from '@nestjs/common'
import { AuthMiddleware } from '../auth'
import { LocationController } from './locations.controller'
import { LocationService } from './locations.service'
import { LocationRepository } from './locations.repository'
import { ResponseModule } from '../response'

@Module({
    imports: [ResponseModule],
    controllers: [LocationController],
    providers: [LocationService, LocationRepository],
    exports: [LocationService, LocationRepository]
})
export class LocationModule implements NestModule{
    public configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(LocationController);
    }
}