import { Document } from 'mongoose'

// export interface IFLocation extends Document {
//     readonly _id: string;
//     location: string
//     address: string
//     start_time: string
//     end_time: string
//     setName(): void;
// }

export class IFLocation extends Document {
    readonly _id: string;
    location: string
    address: string
    start_time: string
    end_time: string
    
    setName(){
        this.location = this.location+"1"
    }
}