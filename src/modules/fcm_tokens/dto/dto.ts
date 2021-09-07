import { IsNotEmpty, IsString } from 'class-validator';

export class FcmTokenDto {

    @IsString()
    @IsNotEmpty()
    fcm_token: string;

}