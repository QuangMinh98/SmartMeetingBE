import { Module } from '@nestjs/common';
import { ForgotPasswordController } from './forgot_password.controller';
import { ForgotPasswordService } from './forgot_password.service';

@Module({
    imports: [],
    controllers: [ForgotPasswordController],
    providers: [ForgotPasswordService]
})
export class ForgotPasswordModule {}
