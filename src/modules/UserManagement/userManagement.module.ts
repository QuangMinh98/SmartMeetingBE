import { Module } from '@nestjs/common';
import { UserModule } from './users';
import { RoleModule } from './roles';
import { FcmTokenModule } from './fcm_tokens';
import { ForgotPasswordModule } from './forgot_password';
import { RegisterModule } from './register';
import { AuthModule } from './auth';

@Module({
    imports: [UserModule, RoleModule, FcmTokenModule, ForgotPasswordModule, RegisterModule, AuthModule],
    providers: [],
    exports: []
})
export class UserManagementModule {}
