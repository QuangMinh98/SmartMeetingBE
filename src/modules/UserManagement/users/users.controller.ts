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
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserDto } from './dto/dto';
import { PagingPipe } from 'src/common/pipes/paging.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { ChangePasswordDto } from './dto/change-password-dto';
import { Admin } from 'src/common/decorators/admin.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/me')
    async findMe(@User() user) {
        return this.userService.GetById(user._id);
    }

    @Get('')
    async GetAllUsers(@Query(new PagingPipe()) query: { page?: number; limit?: number; search_string?: string }) {
        return this.userService.GetAll(query);
    }

    @Get('/:id')
    async GetUserById(@Param('id') id: string) {
        return this.userService.GetById(id);
    }

    @Put('/me/change-password')
    @UsePipes(new ValidationPipe())
    async ChangePassword(@User() user, @Body() body: ChangePasswordDto) {
        return this.userService.changePassword(user._id, body.password, body.newPassword);
    }

    @Put('/me')
    @UsePipes(new ValidationPipe())
    async changeUserInfo(@User() user, @Body() userData: UserDto) {
        return this.userService.update(user._id, userData);
    }

    @Put('/:id')
    async UpdateUser(@Param('id') id: string, @Body() userData: UserDto) {
        return this.userService.update(id, userData);
    }

    @Delete('/:id')
    @Admin(true)
    async DeleteUser(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
