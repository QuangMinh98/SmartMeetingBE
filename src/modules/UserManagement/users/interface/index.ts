import { Document } from 'mongoose';

export interface IFUser extends Document, IFUserDoc {
    _id: string;
    avatar: string;
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
    address: string;
    role: any;
    admin: boolean;
    birthdate: number;
    gender: string;
    status: string;
    lang: string;
    created_time: number;
    fcm_token: string[];
}

export interface IFUserDoc {
    generateToken(key: string, tokenExpireIn: string): string;
    comparePassword(password: string): boolean;
    hashPassword(): void;
}
