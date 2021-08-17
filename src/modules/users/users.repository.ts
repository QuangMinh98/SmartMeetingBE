import {
    Injectable,
    NotFoundException 
} from '@nestjs/common'
import { User } from './model'
import { IFUser } from './interface'
import { UpdateQuery, Schema } from 'mongoose'
import { UserDto } from './dto/dto'
import { IFResponse, ResponseRepository } from '../response'

@Injectable()
export class UserRepository {
    
    constructor(private readonly responseRepo: ResponseRepository){}

    fromEntity(data: any): IFUser {
        return data
    }

    async create(userData: UserDto): Promise<IFUser>{
        const user = new User(userData)
        await user.save();

        return user;
    }

    async findAllAndPaging(
        { page, limit, sort }: { page: number, limit: number, sort?: any },
        filter?: any
    ): Promise<IFResponse<IFUser>>{
        let skip: number = 0;
        skip = (page -1) * limit;

        const users:IFUser[] = await User.find(filter)
        .skip(skip)
        .limit(+limit)
        .sort(sort)
        .select('-password');
        const totalRecords: number = await User.countDocuments(filter)
        
        return this.responseRepo.getResponse<IFUser>(users, totalRecords, page, limit)
    }

    async findAll(filter?: any): Promise<IFUser[]>{
        const users = await User.find(filter)
        return users
    }

    async findById(id: string): Promise<IFUser> {
        try{
            const user: IFUser = await User.findById(id);
            if(!user) throw new NotFoundException("User not found")

            return user
        }
        catch(err){
            throw new NotFoundException("User not found")
        }
    }

    async updateById (
        id: string,
        userData: UserDto,
        options: any
    ): Promise<IFUser>{
        try{
            const user = await User.findByIdAndUpdate(id, userData, options);
            if(!user) throw new NotFoundException("User not found")

            return this.fromEntity(user);
        }
        catch(err){
            throw new NotFoundException("User not found")
        }

    }

    async deleteById(id: string): Promise<IFUser>{
        try{
            const user: IFUser = await User.findByIdAndDelete(id);
            if(!user) throw new NotFoundException("User not found")

            return user
        }
        catch(err){
            throw new NotFoundException("User not found")
        }
    }

}