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
} from '@nestjs/common';
import { Request } from 'express'
import { UserService } from './users.service';
import { UserDto } from './dto/dto';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('/me')
    async findMe(@Req() req: Request){
        return this.userService.GetById(req.user._id)
    }

    @Get('')
    async GetAllUsers(@Query() query: { page?:number, limit?:number, search_string?: string}) {
        return this.userService.GetAll(query);
    }

    @Get('/:id')
    async GetUserById(@Param('id') id: string) {
        return this.userService.GetById(id);
    }

    @Put('/:id')
    async UpdateUser(@Param('id') id: string, @Body() userData: UserDto) {
        return this.userService.update(id, userData);
    }

    @Delete('/:id')
    async DeleteUser(@Param('id') id: string){
        return this.userService.delete(id);
    }

}