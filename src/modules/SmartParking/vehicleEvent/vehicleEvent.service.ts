import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { RequestService } from 'src/shared/services/request.service';
import { AuthTokenService } from '../authToken/authToken.service';
import { IFVehicleEvent } from './interface';

@Injectable()
export class VehicleEventService {
    constructor(
        private readonly requestService: RequestService,
        private readonly configService: ConfigService,
        private readonly authTokenService: AuthTokenService
    ) {}

    mapFromRawJsonToEventVehicle(json: any): IFVehicleEvent {
        return {
            PageIndex: json.PageIndex,
            PageSize: json.PageSize,
            TotalItem: json.TotalItem,
            TotalPage: json.TotalPage,
            TotalMoney: json.TotalMoney,
            ReportInOut_data: json.ReportInOut_data.map((data) => {
                return {
                    EventID: data.EventID,
                    CardName: data.CardName,
                    PlateNumber: data.PlateNumber,
                    DateTimeIn: data.DateTimeIn,
                    DateTimeOut: data.DateTimeOut,
                    Moneys: data.Moneys,
                    CardGroupId: data.CardGroupId,
                    CardGroupName: data.CardGroupName,
                    VehicleGroupID: data.VehicleGroupID,
                    VehicleGroupName: data.VehicleGroupName,
                    CustomerName: data.CustomerName,
                    CustomerGroupID: data.CustomerGroupID,
                    CustomerGroupName: data.CustomerGroupName
                };
            })
        };
    }

    async getVehicleEvent({
        page,
        limit,
        plateNumber,
        fromDate,
        toDate
    }: {
        page?: number;
        limit?: number;
        plateNumber?: string;
        fromDate?: number;
        toDate?: number;
    }) {
        const path = `/api/3rd_event/byOutPaging?IsHaveTimeIn=false&PlateNumber=${
            plateNumber ? plateNumber : ''
        }&FromDate=${fromDate}&ToDate=${toDate}&PageSize=${limit ? limit : ''}&PageIndex=${page ? page : ''}`;

        let authToken = await this.authTokenService.getTokenFromDB();
        let response = await this.requestService.get({
            url: this.configService.get('apiDomain') + path,
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        if (response.status === 200) return this.mapFromRawJsonToEventVehicle(response.data);
        else {
            authToken = await this.authTokenService.getToken();
            response = await this.requestService.get({
                url: this.configService.get('apiDomain') + path,
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return this.mapFromRawJsonToEventVehicle(response.data);
        }
    }
}
