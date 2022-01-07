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
import { ForgotPasswordService } from './forgot_password.service';

@Controller('forgot-password')
export class ForgotPasswordController {
    constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

    @Post('')
    @HttpCode(200)
    forgotPassword(@Body('email') email: string) {
        return this.forgotPasswordService.forgotPassword(email);
    }

    @Put('reset-token')
    resetPassword(@Body('email') email: string, @Body('password') password: string, @Body('token') token: string) {
        return this.forgotPasswordService.resetPassword(email, password, token);
    }
}
