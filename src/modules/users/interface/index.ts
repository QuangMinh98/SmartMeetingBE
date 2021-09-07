import { Document, Schema, QueryOptions } from 'mongoose';

export interface IFUser extends Document, IFUserDoc {
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
    fcm_token: string[],
}

export interface IFUserDoc {
    generateToken(): string,
    comparePassword(password: string): boolean,
    hashPassword(): void
}
