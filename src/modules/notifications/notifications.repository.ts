import { Injectable } from '@nestjs/common';
import { IFResponse, ResponseService } from 'src/shared';
import { IFNotification } from './interface';
import { Notification } from './model';

@Injectable()
export class NotificationRepository {

    constructor(private readonly responseService: ResponseService){}

    async create(notificationData: any){
        const notification = new Notification(notificationData);
        await notification.save();

        return notification;
    }

    async insertMany(notificationData: any[]){
        await Notification.create(notificationData);
    }

    async findAllAndPaging(
        { page, limit, sort }: { page: number, limit: number, sort?: any},
        filter?: any
    ): Promise<IFResponse<IFNotification>> {
        let skip = 0;
        skip = (page -1) * limit;

        const notifications = await Notification.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort);
        const totalRecords: number = await Notification.countDocuments(filter);

        return this.responseService.getResponse<IFNotification>(notifications, totalRecords, page, limit);
    }

}