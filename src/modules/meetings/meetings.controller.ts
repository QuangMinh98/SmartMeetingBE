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
import { Request, Response } from 'express';
import { MeetingDto } from './dto/dto';
import { MeetingService } from './meetings.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('meetings')
export class MeetingController {

    constructor(private readonly meetingService: MeetingService) {}

    @Post('')
    @HttpCode(200)
    create(@User() user, @Body() meetingData: MeetingDto){
        return this.meetingService.create({
            ...meetingData,
            user_booked: user._id
        });
    }

    @Get('/my-meetings')
    getByMe(@User() user, @Query() query: {start_time?: number, end_time?: number}){
        return this.meetingService.getMyMeeting(user._id, query);
    }

    @Get('/booked')
    getMeetingIBooked(@User() user, @Query() query: {start_time?: number, end_time?: number}){
        return this.meetingService.getMeetingIBooked(user._id, query);
    }

    @Get('/room/:id')
    getByRoom(@Param('id') id: string, @Query() query: { start_time?: number, end_time?: number}){
        return this.meetingService.getByRoom(id, query);
    }

    @Get('/:id')
    getById(@User() user, @Param('id') id: string){
        return this.meetingService.getById(id, { 
            userId: user._id,  
            isAdmin: user.admin
        });
    }

    @Put('/:id')
    update(@User() user, @Param('id') id: string, @Body() meetingData: MeetingDto){
        return this.meetingService.update(id, meetingData, { 
            userId: user._id,
            isAdmin: user.admin
        });
    }

    @Delete('/:id')
    delete(@User() user, @Param() id: string){
        return this.meetingService.delete(id, {
            userId: user._id,
            isAdmin: user.admin
        });
    }

}