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
} from '@nestjs/common';
import { Request, Response } from 'express'
import { MeetingDto } from './dto/dto'
import { MeetingService } from './meetings.service';

@Controller('meetings')
export class MeetingController {

    constructor(private readonly meetingService: MeetingService) {}

    @Post('')
    create(@Req() req: Request, @Body() meetingData: MeetingDto){
        return this.meetingService.create({
            ...meetingData,
            user_booked: req.user._id
        })
    }

    @Get('/my-meetings')
    getByMe(@Req() req: Request, @Query() query: {start_time?: number, end_time?: number}){
        return this.meetingService.getByUser(req.user._id, query)
    }

    @Get('/room/:id')
    getByRoom(@Param('id') id: string){
        return this.meetingService.getByRoom(id)
    }

    @Get('/:id')
    getById(@Req() req: Request, @Param('id') id: string){
        return this.meetingService.getById(id, { 
            userId: req.user._id,  
            isAdmin: req.user.admin
        })
    }

    @Put('/:id')
    update(@Req() req: Request, @Param('id') id: string, @Body() meetingData: MeetingDto){
        return this.meetingService.update(id, meetingData, { 
            userId: req.user._id,
            isAdmin: req.user.admin
        })
    }

    @Delete('/:id')
    delete(@Req() req: Request, @Param() id: string){
        return this.meetingService.delete(id, {
            userId: req.user._id,
            isAdmin: req.user.admin
        })
    }

}