import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IFDevice } from '../interface';

const DeviceSchema = new Schema({
    device_name: {
        type: String
    },
    note: {
        type: String
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    device_type: {
        type: Number
    },
    is_on: {
        type: Boolean,
        default: false
    },
    max_value: {
        type: Number
    },
    current_value: {
        type: Number
    },
    min_value: {
        type: Number
    },
    cestron_device_id: {
        type: String
    },
    cestron_device_id_off: {
        type: String
    },
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

export const Device = mongoose.model<IFDevice>('Device', DeviceSchema);