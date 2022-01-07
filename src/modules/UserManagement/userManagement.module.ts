import { Module } from '@nestjs/common';
import { UserModule } from './users';
import { RoleModule } from './roles';
import { FcmTokenModule } from './fcm_tokens';
import { ForgotPasswordModule } from './forgot_password';
import { RegisterModule } from './register';
import { AuthModule } from './auth';
import { NotificationModule } from './notifications';

@Module({
    imports: [
        UserModule,
        RoleModule,
        FcmTokenModule,
        ForgotPasswordModule,
        RegisterModule,
        AuthModule,
        NotificationModule
    ],
    providers: [],
    exports: []
})
export class UserManagementModule {}
