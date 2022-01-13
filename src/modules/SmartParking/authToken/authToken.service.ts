import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { RequestService } from 'src/shared/services/request.service';

@Injectable()
export class AuthTokenService {
    constructor(
        private readonly configService: ConfigService,
        private readonly requestService: RequestService,
        @Inject(CACHE_MANAGER) private cacheManager
    ) {}

    async updateToken(token: string) {
        const EXPIRE_TIME = 86399;
        await this.cacheManager.set('authToken', token, { ttl: EXPIRE_TIME });
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
        const token = await this.cacheManager.get('authToken');
        if (!token) return await this.getToken();

        return token;
    }
}
