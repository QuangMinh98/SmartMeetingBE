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
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { Admin } from 'src/common/decorators/admin.decorator';
import { RoleDto } from './dto/dto';
import { RoleService } from './roles.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    @Admin(true)
    create(@Body() roleData: RoleDto) {
        return this.roleService.create(roleData);
    }

    @Get()
    @Admin(true)
    getAll(@Query() query: { page?: number; limit?: number }) {
        return this.roleService.getAll(query);
    }

    @Get('/:id')
    @Admin(true)
    getById(@Param('id') id: string) {
        return this.roleService.getById(id);
    }

    @Put('/:id')
    @Admin(true)
    update(@Param('id') id: string, @Body() roleData: RoleDto) {
        return this.roleService.update(id, roleData);
    }

    @Delete('/:id')
    @Admin(true)
    delete(@Param('id') id: string) {
        return this.roleService.delete(id);
    }
}
