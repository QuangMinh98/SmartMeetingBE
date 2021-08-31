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
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from './schema'

@Module({
    imports: [ResponseModule, MongooseModule.forFeature([{ name: "Location", schema: LocationSchema }])],
    controllers: [LocationController],
    providers: [LocationService, LocationRepository],
    exports: [LocationService, LocationRepository]
})
export class LocationModule {}
// export class LocationModule implements NestModule{
//     public configure(consumer: MiddlewareConsumer) {
//         consumer
//           .apply(AuthMiddleware)
//           .forRoutes(LocationController);
//     }
// }