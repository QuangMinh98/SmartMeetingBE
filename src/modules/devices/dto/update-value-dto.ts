import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateValueDto {

    @IsBoolean()
    @IsNotEmpty()
    is_on: boolean;

    @IsNumber()
    @IsOptional()
    current_value: number;
    
}