import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsString({ each: true })
    roles: string[];
}
