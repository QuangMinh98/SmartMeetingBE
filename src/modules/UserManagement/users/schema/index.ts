import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IFUser } from '../interface';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Schema()
export class User {
    @Prop()
    fullname: string;

    @Prop()
    avatar: string;

    @Prop()
    email: string;

    @Prop()
    phone_number: string;

    @Prop()
    password: string;

    @Prop()
    address: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }])
    roles: string[];

    @Prop({ default: false })
    admin: boolean;

    @Prop()
    birthdate: number;

    @Prop()
    gender: string;

    @Prop()
    status: string;

    @Prop()
    fcm_token: string[];

    @Prop({ default: Date.now(), immutable: true })
    created_time: number;
}

type TypeUserSchema = mongoose.Schema<IFUser, mongoose.Model<any, any, any>, undefined, any>;

export const UserSchema: TypeUserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (): string {
    return jwt.sign({ _id: this._id, admin: this.admin, role: this.role }, '1234qwer!@#$');
};

UserSchema.methods.hashPassword = async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
};

UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
