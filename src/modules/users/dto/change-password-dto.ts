import { IsNotEmpty, IsString, Length } from "class-validator";

export class ChangePasswordDto {

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @Length(6, 50)
    @IsNotEmpty()
    newPassword: string;

}