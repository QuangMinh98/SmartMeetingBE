import { IsNotEmpty } from 'class-validator';

export class EditUserDto {
    @IsNotEmpty()
    readonly fullname: string;

    @IsNotEmpty()
    readonly phone_number: string;

    readonly address: string;

    readonly role: string;

    readonly admin: boolean;

    readonly birthdate: number;

    readonly gender: string;

    readonly status: string;

    readonly lang: string;
}
