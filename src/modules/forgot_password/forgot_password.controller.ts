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

@Controller('forgot-password')
export class ForgotPasswordController {
    @Post('')
    @HttpCode(200)
    forgotPassword() {
        return '';
    }
}
