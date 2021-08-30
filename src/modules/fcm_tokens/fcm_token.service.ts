import { Injectable } from "@nestjs/common";
import { UserRepository } from "../users/users.repository";

@Injectable()
export class FcmTokenService {

    constructor(private readonly userRepo: UserRepository) {}

    async create(id: string, token: string){
        let user = await this.userRepo.findById(id);

    }

}