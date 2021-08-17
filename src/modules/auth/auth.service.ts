import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/dto'
import { User } from '../users'
import { IFUser } from '../users/interface'
import { Post, Res, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthService {

    async login({email, password}: LoginDto, res: Response){
        // Write code to login here

        // Get user info with login email
        let user: IFUser = await User.findOne({ email })
        if (!user)  throw new HttpException({error_code: "01", error_message: "Invalid email or password."}, 400)

        // Password authentication
        const isValid = await user.comparePassword(password);
        if (!isValid) throw new HttpException({error_code: "01", error_message: "Invalid email or password."}, 400)

        // Generate token
        const token = user.generateToken();
        const response = user
        return res.header('x-auth-token', token).send(response);
    }

}