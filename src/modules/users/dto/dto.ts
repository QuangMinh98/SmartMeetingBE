import { IsNotEmpty } from 'class-validator';

export class UserDto {

    @IsNotEmpty()
    readonly fullname: string

    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    readonly password: string

    @IsNotEmpty()
    readonly phone_number: string

    readonly address: string

    readonly roles: string[]
    
    readonly admin: boolean

    readonly birthdate: number

    readonly gender: string

    readonly status: string
}