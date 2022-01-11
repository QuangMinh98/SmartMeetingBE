import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ApiAuthTokenSchema = new Schema({
    token: {
        type: String
    }
});

export const AuthToken = mongoose.model('ApiAuthToken', ApiAuthTokenSchema);
