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
import { Request } from 'Express'
import { FcmTokenDto } from './dto/dto';
import { FcmTokenService } from './fcm_token.service';

@Controller('fcm_token')
export class FcmTokenController {

    constructor(private readonly fcmTokenService: FcmTokenService) {}

    @Post('')
    @HttpCode(200)
    create(@Req() req: Request, @Body() body: FcmTokenDto) {
        return this.fcmTokenService.create(req.user._id, body.fcm_token)
    }

    @Delete('')
    remove(@Req() req: Request, @Body() body: FcmTokenDto) {
        return this.fcmTokenService.remove(req.user._id, body.fcm_token)
    }

}