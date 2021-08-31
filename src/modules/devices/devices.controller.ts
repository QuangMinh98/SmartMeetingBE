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
    HttpCode
} from '@nestjs/common';
import { DeviceDto } from './dto/dto'
import { DeviceService } from './devices.service';
import { RoleGuard } from '../roles';

@Controller('devices')
export class DeviceController{

    constructor(private deviceService: DeviceService) {}

    @Post('')
    @HttpCode(200)
    @UseGuards(new RoleGuard('Device', 'admin'))
    create(deviceData: DeviceDto) {
        return this.deviceService.create(deviceData)
    }

    @Get('')
    @UseGuards(new RoleGuard('Device', 'admin'))
    getAll(@Query() query: { page?: number, limit?: number}){
        return this.deviceService.getAll(query)
    }

    @Get('/room/:id')
    getByRoomId(@Param('id') id: string, @Query() query: { page?: number, limit?: number}){
        return this.deviceService.getByRoomId(id, query)
    }

    @Get('/:id')
    @UseGuards(new RoleGuard('Device', 'admin'))
    getById(@Param('id') id: string){
        return this.deviceService.getById(id)
    }

    @Put('/:id')
    @UseGuards(new RoleGuard('Device', 'admin'))
    update(@Param('id') id: string,@Body()deviceData: DeviceDto){
        return this.deviceService.update(id, deviceData)
    }

    @Put('data/:id')
    updateValue(@Param('id')id: string,@Body() deviceData){
        return this.deviceService.updateValue(id, deviceData)
    }

    @Delete('/:id')
    @UseGuards(new RoleGuard('Device', 'admin'))
    delete(@Param('id') id: string){
        return this.deviceService.delete(id)
    }
}