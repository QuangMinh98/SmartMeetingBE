import { Injectable } from "@nestjs/common";
import { UserRepository } from "../users/users.repository";

@Injectable()
export class FcmTokenService {

    constructor(private readonly userRepo: UserRepository) {}

    async create(id: string, fcm_token: string){
        let user = await this.userRepo.findById(id);

        if(!user.fcm_token.includes(fcm_token)){
            user.fcm_token.push(fcm_token);
            user.save();
        }

        return user
    }

    async remove(id: string, fcm_token: string){
        let user = await this.userRepo.findById(id);
        user.fcm_token = user.fcm_token.filter(item => item !== fcm_token);

        return user
    }

}