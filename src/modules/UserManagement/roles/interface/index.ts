import { Document } from 'mongoose';

export interface IFRole extends Document {
    readonly _id: string;
    name: string;
    modules: string[];
    created_time: number;
    updated_time: number;
    user_created: string;
    user_updated: string;
}
