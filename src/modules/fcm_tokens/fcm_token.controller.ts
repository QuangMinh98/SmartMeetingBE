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
    ValidationPipe
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { FcmTokenDto } from './dto/dto';
import { FcmTokenService } from './fcm_token.service';

@Controller('fcm_token')
export class FcmTokenController {
    constructor(private readonly fcmTokenService: FcmTokenService) {}

    @Post('')
    @HttpCode(200)
    create(@User() user, @Body(new ValidationPipe()) body: FcmTokenDto) {
        return this.fcmTokenService.create(user._id, body.fcm_token);
    }

    @Delete('')
    remove(@User() user, @Body(new ValidationPipe()) body: FcmTokenDto) {
        return this.fcmTokenService.remove(user._id, body.fcm_token);
    }
}
