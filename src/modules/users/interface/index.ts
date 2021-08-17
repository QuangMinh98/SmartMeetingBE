import { Document, Schema, QueryOptions } from 'mongoose'
import { UserDto } from '../dto/dto'

export interface IFUser extends Document {
    _id: string,
    avatar: string,
    fullname: string,
    email: string,
    phone_number: string,
    password: string,
    address: string,
    roles: string[],
    admin: boolean,
    birthdate: number,
    gender: string,
    status: string,
    created_time: number,
    generateToken(): string,
    comparePassword(password: string): boolean,
    hashPassword(): void
}
