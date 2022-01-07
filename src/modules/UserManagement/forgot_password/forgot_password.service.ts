import { HttpException, Injectable } from '@nestjs/common';
import { HelperService } from 'src/shared';
import { MailService } from 'src/shared';
import { UserRepository } from '../users';

@Injectable()
export class ForgotPasswordService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly helperService: HelperService,
        private readonly mailService: MailService
    ) {}

    async forgotPassword(email: string) {
        const user = await this.userRepo.findOne({ email });
        if (!user) throw new HttpException({ error_code: '400', error_message: 'Invalid email or password.' }, 400);

        const token = this.helperService.makeToken(6);
        user.forgot_password_token = token;

        user.save();

        this.mailService.sendEmail({
            from: `"Công Ty TNHH JoyTech"`, // sender address
            to: email, // list of receivers
            subject: 'Forgot password', // Subject line
            text: 'Forgot password', // plain text body
            html: token // html body
        });

        return '';
    }

    async resetPassword(email: string, password: string, token: string) {
        const user = await this.userRepo.findOne({ email, forgot_password_token: token });
        if (!user) throw new HttpException({ error_code: '400', error_message: 'Invalid email or password.' }, 400);

        user.password = password;
        await user.hashPassword();
        user.forgot_password_token = '';

        user.save();

        return user;
    }
}
