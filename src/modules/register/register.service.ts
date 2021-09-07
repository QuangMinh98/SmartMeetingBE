import { Post, Res, HttpStatus, HttpException, NotFoundException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/dto';
import { User } from '../users';

export class RegisterService {

    async register(userData: RegisterDto){
        // Check if email already registed
        const existedUser = await User.findOne({email: userData.email}).select({_id: 1});
        if(existedUser) throw new HttpException({error_code: '400', error_message: 'Email is already registed'}, 400);

        // Create a new user
        const user = new User(userData);
        await user.hashPassword();

        await user.save();

        return user;
    }

}