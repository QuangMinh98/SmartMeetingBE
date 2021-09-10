import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Patch,
    Delete,
    Inject,
    HttpStatus,
    Res,
    NotFoundException,
    ConflictException,
    Query,
    UseGuards,
    HttpCode,
    Req,
    ParseIntPipe
} from '@nestjs/common';
import { Request } from 'express';
import { PagingPipe } from 'src/common/pipes/paging.pipe';
import { NotificationService } from './notifications.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('notifications')
export class NotificationController {

    constructor(private readonly notificationService: NotificationService) {}

    @Get('')
    getAll(@User() user, @Query(new PagingPipe()) query: { page?: number, limit?: number, search_string?: string}){
        return this.notificationService.getAll(query, user._id);
    }

}