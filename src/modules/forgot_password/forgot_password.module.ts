import { Module } from '@nestjs/common';
import { ForgotPasswordController } from './forgot_password.controller';

@Module({
    imports: [],
    controllers: [ForgotPasswordController],
    providers: []
})
export class ForgotPasswordModule {}
