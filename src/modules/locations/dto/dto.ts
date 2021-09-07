import { IsNotEmpty } from "class-validator";

export class LocationDto {

    @IsNotEmpty()
    readonly location: string;

    @IsNotEmpty()
    readonly address: string;

    readonly start_time: string;

    readonly end_time: string;

    readonly user_created?: string;

    readonly user_updated?: string;
}