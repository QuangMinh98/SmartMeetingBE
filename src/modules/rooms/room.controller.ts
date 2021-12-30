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
import { Request } from 'express';
import { RoomDto } from './dto/dto';
import { RoomService } from './room.service';
import { PagingPipe } from 'src/common/pipes/paging.pipe';
import { Admin } from 'src/common/decorators/admin.decorator';

@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post('')
    @HttpCode(200)
    @Admin(true)
    async create(@Body() roomData: RoomDto) {
        return this.roomService.create(roomData);
    }

    @Get('')
    async getAll(@Query(new PagingPipe()) query: { page?: number; limit?: number }) {
        return this.roomService.getAll(query);
    }

    @Get('/:id')
    async getById(@Param('id') id: string) {
        return this.roomService.getById(id);
    }

    @Put('/:id')
    @Admin(true)
    async update(@Param('id') id: string, @Body() roomData: RoomDto) {
        return this.roomService.update(id, roomData);
    }

    @Delete('/:id')
    @Admin(true)
    async delete(@Param('id') id: string) {
        return this.roomService.delete(id);
    }
}
