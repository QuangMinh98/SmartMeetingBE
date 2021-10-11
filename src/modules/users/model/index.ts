import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IFUser } from '../interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const UserSchema = new Schema<IFUser>({
    fullname: {
        type: String
    },
    avatar: {
        type: String
    },
    email: {
        type: String
    },
    phone_number: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    ],
    admin: {
        type: Boolean,
        default: false
    },
    birthdate: {
        type: Number
    },
    gender: {
        type: String
    },
    status: {
        type: String
    },
    fcm_token: [
        {
            type: String
        }
    ],
    created_time: {
        type: Number,
        default: Date.now(),
        immutable: true
    }
});

UserSchema.index({ email: 'text' });

UserSchema.methods.generateToken = function (key: string, tokenExpireIn: string): string {
    return jwt.sign({ _id: this._id, admin: this.admin, roles: this.roles }, key, {
        expiresIn: tokenExpireIn
    });
};

UserSchema.methods.hashPassword = async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
};

UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IFUser>('User', UserSchema);
