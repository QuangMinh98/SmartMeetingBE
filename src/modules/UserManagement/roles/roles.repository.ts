import { HttpException, Injectable } from '@nestjs/common';
import { Role } from './model';
import { IFRole } from './interface';
import { RoleDto } from './dto/dto';
import { IFResponse, ResponseService } from 'src/shared';

@Injectable()
export class RoleRepository {
    constructor(private readonly responseService: ResponseService) {}

    async create(roleData: RoleDto): Promise<IFRole> {
        const role = new Role(roleData);
        await role.save();

        return role;
    }

    async findAllAndPaging(
        { page, limit, sort }: { page: number; limit: number; sort?: any },
        filter?: any
    ): Promise<IFResponse<IFRole>> {
        let skip = 0;
        skip = (page - 1) * limit;

        const roles: IFRole[] = await Role.find(filter)
            .limit(+limit)
            .skip(skip)
            .sort(sort);
        const totalRecords: number = await Role.countDocuments(filter);

        return this.responseService.getResponse<IFRole>(roles, totalRecords, page, limit);
    }

    async findById(id: string): Promise<IFRole> {
        try {
            const role = await Role.findById(id);
            if (!role) throw new HttpException({ error_code: '401', error_message: 'Role not found!' }, 404);

            return role;
        } catch (err) {
            throw new HttpException({ error_code: '401', error_message: 'Role not found!' }, 404);
        }
    }

    async findAll(filter?: any): Promise<IFRole[]> {
        const roles = await Role.find(filter);

        return roles;
    }

    async updateById(id: string, roleData: RoleDto): Promise<IFRole> {
        try {
            const role = await Role.findByIdAndUpdate(id, roleData, { new: true });
            if (!role) throw new HttpException({ error_code: '401', error_message: 'Role not found!' }, 404);

            return role;
        } catch (err) {
            throw new HttpException({ error_code: '401', error_message: 'Role not found!' }, 404);
        }
    }

    async deleteById(id: string): Promise<IFRole> {
        try {
            const role = await Role.findByIdAndDelete(id);
            if (!role) throw new HttpException({ error_code: '401', error_message: 'Role not found!' }, 404);

            return role;
        } catch (err) {
            throw new HttpException({ error_code: '401', error_message: 'Role not found!' }, 404);
        }
    }
}
