import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IFRole } from '../interface';

export const RoleSchema = new Schema({
    name: {
        type: String
    },
    modules: [
        {
            type: String
        }
    ],
    created_time: {
        type: Number,
        default: Date.now(),
        immutable: true
    },
    updated_time: {
        type: Number,
        default: Date.now()
    },
    user_created: {
        type: Schema.Types.ObjectId,
        immutable: true
    },
    user_updated: {
        type: Schema.Types.ObjectId
    }
});

export const Role = mongoose.model<IFRole>('Role', RoleSchema);
