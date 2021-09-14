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
    HttpCode,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { Response } from 'express';
import { IFAuthentication } from './interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/dto';

@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async login(@Body() loginData: LoginDto, @Res() res: Response) {
        console.log(loginData);
        return this.authService.login(loginData, res);
    }
}
