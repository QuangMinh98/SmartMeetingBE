import { Injectable } from '@nestjs/common';
import { RoleDto } from './dto/dto';
import { RoleRepository } from './roles.repository';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepo: RoleRepository) {}

    create(roleData: RoleDto) {
        return this.roleRepo.create(roleData);
    }

    getAll({ page, limit }: { page?: number; limit?: number }) {
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.roleRepo.findAllAndPaging({
            page,
            limit,
            sort: { created_time: -1 }
        });
    }

    getById(id: string) {
        return this.roleRepo.findById(id);
    }

    update(id: string, roleData: RoleDto) {
        return this.roleRepo.updateById(id, roleData);
    }

    delete(id: string) {
        return this.roleRepo.deleteById(id);
    }
}
