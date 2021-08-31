import * as mongoose from "mongoose";
import { Schema } from "mongoose"
import { IFLocation } from "../interface";

const LocationSchema = new Schema({
    location: {
        type: String
    },
    address: {
        type: String
    },
    start_time: {
        type: String,
        default: "00:00"
    },
    end_time: {
        type: String,
        default: "23:59"
    }
})

// export const Location = mongoose.model<IFLocation>('Location', LocationSchema)