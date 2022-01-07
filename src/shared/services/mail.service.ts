import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from 'src/config';

@Injectable()
export class MailService {
    private readonly mailAddress: string;
    private readonly mailPassword: string;

    constructor(private configService: ConfigService) {
        this.mailAddress = this.configService.get('mailAddress');
        this.mailPassword = this.configService.get('mailPassword');
    }

    async sendEmail(data: { from: string; to: string; subject: string; text: string; html: string }) {
        try {
            data.from = data.from + `<${this.mailAddress}>`;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.mailAddress, // generated ethereal user
                    pass: this.mailPassword // generated ethereal password
                }
            });
            const info = await transporter.sendMail(data);
            console.log(info.messageId);
        } catch (err) {
            console.log(err.message);
        }
    }
}
