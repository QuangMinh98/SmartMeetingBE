import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeviceDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly device_name: string;

    @ApiProperty()
    @IsString()
    readonly note: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly room: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly device_type: number;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    readonly is_on?: boolean;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    readonly max_value?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    readonly min_value?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    readonly current_value?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly cestron_device_id?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly cestron_device_id_off?: string;
}
