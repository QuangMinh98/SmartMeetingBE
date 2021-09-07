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
    Req
} from '@nestjs/common';
import { Request } from 'express'
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {

    constructor(private readonly notificationService: NotificationService) {}

    @Get('')
    getAll(@Req() req: Request, @Query() query: { page?: number, limit?: number}){
        return this.notificationService.getAll(query, req.user._id);
    }

}