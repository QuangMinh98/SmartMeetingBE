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
    HttpCode,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { DeviceDto } from './dto/dto';
import { DeviceService } from './devices.service';
import { UpdateValueDto } from './dto/update-value-dto';
import { Admin } from 'src/common/decorators/admin.decorator';

@Controller('devices')
export class DeviceController {
    constructor(private deviceService: DeviceService) {}

    @Post('')
    @HttpCode(200)
    @Admin(true)
    @UsePipes(new ValidationPipe())
    create(@Body() deviceData: DeviceDto) {
        return this.deviceService.create(deviceData);
    }

    @Get('')
    @Admin(true)
    getAll(@Query() query: { page?: number; limit?: number }) {
        return this.deviceService.getAll(query);
    }

    @Get('/room/:id')
    getByRoomId(@Param('id') id: string, @Query() query: { page?: number; limit?: number }) {
        return this.deviceService.getByRoomId(id, query);
    }

    @Get('/:id')
    @Admin(true)
    getById(@Param('id') id: string) {
        return this.deviceService.getById(id);
    }

    @Put('/:id')
    @Admin(true)
    @UsePipes(new ValidationPipe())
    update(@Param('id') id: string, @Body() deviceData: DeviceDto) {
        return this.deviceService.update(id, deviceData);
    }

    @Put('data/:id')
    @UsePipes(new ValidationPipe())
    updateValue(@Param('id') id: string, @Body() deviceData: UpdateValueDto) {
        return this.deviceService.updateValue(id, deviceData);
    }

    @Delete('/:id')
    @Admin(true)
    delete(@Param('id') id: string) {
        return this.deviceService.delete(id);
    }
}
