import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'src/config';

@Injectable()
export class FirebaseService {
    private readonly firebaseToken: string;
    private readonly firebaseURL: string;

    constructor(private readonly configService: ConfigService) {
        this.firebaseToken = this.configService.get('firebaseToken');
        this.firebaseURL = this.configService.get('firebaseURL');
    }

    async sendRequest(url, data) {
        const response = await axios.request({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + this.firebaseToken
            },
            data
        });
        return response.data;
    }

    async sendNotifications(tokens: string[], data: any) {
        try {
            const result = await this.sendRequest(this.firebaseURL, {
                registration_ids: tokens,
                content_available: true,
                notification: data,
                priority: 'high',
                data: {
                    ...data,
                    url: 'https://www.google.com/',
                    img: 'https://media3.scdn.vn/img4/2020/04_16/1vz9YFtpDPe3LYkiryuA_simg_de2fe0_500x500_maxb.jpg'
                }
            });
            console.log(result);
        } catch (error) {
            console.log(error.message);
        }
    }
}
