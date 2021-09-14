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
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { RegisterDto } from './dto/dto';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post('')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async register(@Body() userData: RegisterDto) {
        return this.registerService.register(userData);
    }
}
