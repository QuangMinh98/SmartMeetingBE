import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Patch,
    Put,
    Delete,
    Inject,
    HttpStatus,
    Res,
    Req,
    NotFoundException,
    ConflictException,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { VehicleEventService } from './vehicleEvent.service';

@Controller('vehicleEvent')
export class VehicleEventController {
    constructor(private readonly vehicleEventService: VehicleEventService) {}

    @Get()
    getAllVehicleEvent(
        @Query() query: { page?: number; limit?: number; plateNumber?: string; fromDate?: number; toDate?: number }
    ) {
        return this.vehicleEventService.getVehicleEvent(query);
    }
}
