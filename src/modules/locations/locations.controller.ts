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
} from '@nestjs/common';
import { LocationDto } from './dto/dto';
import { LocationService } from './locations.service';

@Controller('locations')
export class LocationController {

    constructor(private readonly locationService: LocationService) {}

    @Post('')
    @HttpCode(200)
    create(@Body() locationData: LocationDto){
        return this.locationService.create(locationData);
    }

    @Get('')
    getAll(@Query() query: { page?: number, limit?: number}){
        return this.locationService.getAll(query);
    }

    @Get('/:id')
    getById(@Param('id') id: string){
        return this.locationService.getById(id);
    }

    @Put('/:id')
    update(@Param('id') id: string, @Body() locationData: LocationDto){
        return this.locationService.update(id, locationData);
    }

    @Delete('/:id')
    delete(@Param('id') id: string){
        return this.locationService.delete(id);
    }

}