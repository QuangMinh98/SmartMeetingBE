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
    UseGuards
} from '@nestjs/common';
import { MeetingTypeService } from './meeting_types.service';

@Controller('meeting-types')
export class MeetingTypeController {
    constructor(private readonly meetingService: MeetingTypeService) {}

    @Get('')
    getAll(@Query() query: { page?: number; limit?: number }) {
        return this.meetingService.getAll(query);
    }
}
