import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    readonly fullname: string;

    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @Length(6, 50)
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly phone_number: string;

    @IsString()
    @IsOptional()
    readonly address: string;

    @IsString({ each: true })
    @IsOptional()
    readonly roles: string[];

    @IsBoolean()
    @IsOptional()
    readonly admin: boolean;

    @IsNumber()
    @IsOptional()
    readonly birthdate: number;

    @IsString()
    @IsOptional()
    readonly gender: string;

    @IsString()
    @IsOptional()
    readonly status: string;
}
