import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { RequestService } from 'src/shared/services/request.service';
import { AuthToken } from './model';

@Injectable()
export class AuthTokenService {
    constructor(private readonly configService: ConfigService, private readonly requestService: RequestService) {}

    async updateToken(token: string) {
        const authToken = await AuthToken.findOne();
        if (!authToken) AuthToken.create({ token });
        else {
            authToken.token = token;
            authToken.save();
        }
    }

    async getToken(): Promise<string> {
        const path = '/token';
        const userName = this.configService.get('apiAuthUserName');
        const password = this.configService.get('apiAuthPassword');

        const params = new URLSearchParams();
        params.append('userName', userName);
        params.append('password', password);
        params.append('grant_type', 'password');

        const response = await this.requestService.post({
            url: this.configService.get('apiDomain') + path,
            headers: {},
            body: params
        });

        this.updateToken(response.data.access_token);

        return response.data.access_token;
    }

    async getTokenFromDB(): Promise<string> {
        const token = await AuthToken.findOne();
        if (!token) return await this.getToken();

        return token.token;
    }
}
