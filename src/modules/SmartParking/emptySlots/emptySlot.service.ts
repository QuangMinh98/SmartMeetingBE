import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { RequestService } from 'src/shared/services/request.service';
import { AuthTokenService } from '../authToken/authToken.service';
import { IFEmptySlot, IFEmptySlotCar, IFEmptySlotMoto } from './interface';

@Injectable()
export class EmptySlotService {
    constructor(
        private readonly requestService: RequestService,
        private readonly configService: ConfigService,
        private readonly authTokenService: AuthTokenService
    ) {}

    mapFromRawJsonToIFEmptySlot<I>(json: any): IFEmptySlot<I> {
        return {
            ID: json.ID,
            FloorName: json.FloorName,
            EmptySpaces: json.EmptySpaces
        };
    }

    async getApiData<I>(path: string): Promise<IFEmptySlot<I>[]> {
        let authToken = await this.authTokenService.getTokenFromDB();
        let response = await this.requestService.get({
            url: this.configService.get('apiDomain') + path,
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        if (response.status === 200) return response.data.map((data) => this.mapFromRawJsonToIFEmptySlot<I>(data));
        else {
            authToken = await this.authTokenService.getToken();
            response = await this.requestService.get({
                url: this.configService.get('apiDomain') + path,
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return response.data.map((data) => this.mapFromRawJsonToIFEmptySlot<I>(data));
        }
    }

    async getEmptySlotCar() {
        const path = '/api/3rd_EventParkingControl/getallCar';
        const data = await this.getApiData<IFEmptySlotCar>(path);

        return data;
    }

    async getEmptySlotMoto() {
        const path = '/api/3rd_EventParkingControl/getallMoto';
        const data = await this.getApiData<IFEmptySlotMoto>(path);

        return data;
    }
}
