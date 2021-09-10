import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DeviceDto {

    @IsString()
    @IsNotEmpty()
    readonly device_name: string;

    @IsString()
    readonly note: string;

    @IsString()
    @IsNotEmpty()
    readonly room: string;

    @IsNumber()
    @IsNotEmpty()
    readonly device_type: number;

    @IsBoolean()
    @IsOptional()
    readonly is_on?: boolean;

    @IsNumber()
    @IsOptional()
    readonly max_value?: number;

    @IsNumber()
    @IsOptional()
    readonly min_value?: number;

    @IsNumber()
    @IsOptional()
    readonly current_value?: number;

    @IsString()
    @IsOptional()
    readonly cestron_device_id?: string;

    @IsString()
    @IsOptional()
    readonly cestron_device_id_off?: string;
}