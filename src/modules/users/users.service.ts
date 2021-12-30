import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { HttpStatus, HttpException, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    async GetAll({ page, limit, search_string }: { page?: number; limit?: number; search_string?: string }) {
        const filter: any = {};
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        if (search_string) {
            if (search_string.includes('@')) search_string = search_string.substring(0, search_string.indexOf('@'));
            filter.$text = { $search: search_string };
        }

        return this.userRepo.findAllAndPaging(
            {
                page,
                limit,
                sort: { created_time: -1 }
            },
            filter
        );
    }

    async GetById(id: string) {
        return (await this.userRepo.findById(id))
            .populate({
                path: 'role',
                select: { name: 1, modules: 1 }
            })
            .execPopulate();
    }

    async update(id: string, userData: UserDto) {
        return this.userRepo.updateById(id, userData, { new: true });
    }

    async changePassword(id: string, password: string, newPassword: string) {
        const user = await this.userRepo.findById(id);

        const allow = await user.comparePassword(password);
        if (!allow) throw new HttpException({ error_code: '400', error_message: 'Invalid password' }, 400);

        user.password = newPassword;
        await user.hashPassword();
        await user.save();

        return user;
    }

    async delete(id: string) {
        return this.userRepo.deleteById(id);
    }
}
