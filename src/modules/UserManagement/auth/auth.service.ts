import { pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/dto';
import { UserRepository } from '../users';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from 'src/config';

@Injectable()
export class AuthService {
    constructor(private readonly configService: ConfigService, private readonly userRepo: UserRepository) {}

    async login({ email, password }: LoginDto, res: Response) {
        // Write code to login here
        const JWTKEY = this.configService.get('jwtKey');
        const TOKEN_EXPIRE_IN = this.configService.get('tokenExpireIn');

        // Get user info with login email
        const user = await this.userRepo.findOne({ email });
        if (!user) throw new HttpException({ error_code: '400', error_message: 'Invalid email or password.' }, 400);

        // Password authentication
        const isValid = await user.comparePassword(password);
        if (!isValid) throw new HttpException({ error_code: '400', error_message: 'Invalid email or password.' }, 400);

        // Generate token
        const token = user.generateToken(JWTKEY, TOKEN_EXPIRE_IN);
        const response = pick(user, ['_id', 'email', 'admin', 'fullname', 'phone_number', 'address', 'gender']);

        return res.header('x-auth-token', token).send(response);
    }
}
