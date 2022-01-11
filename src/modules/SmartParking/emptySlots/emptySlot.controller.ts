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
import { EmptySlotService } from './emptySlot.service';

@Controller('emptySlot')
export class EmptySlotController {
    constructor(private readonly emptySlotService: EmptySlotService) {}

    @Get('car')
    getEmptySlotCar() {
        return this.emptySlotService.getEmptySlotCar();
    }

    @Get('moto')
    getEmptySlotMoto() {
        return this.emptySlotService.getEmptySlotMoto();
    }
}
