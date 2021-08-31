import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from "mongoose"
import { Document } from 'mongoose';
import { IFLocation } from "../interface"

@Schema()
export class Location {

    @Prop({ type: String })
    location: string
    
    @Prop({ type: String })
    address: string
    
    @Prop({ type: String })
    start_time: string
    
    @Prop({ type: String })
    end_time: string
}

export const LocationSchema = SchemaFactory.createForClass(Location)