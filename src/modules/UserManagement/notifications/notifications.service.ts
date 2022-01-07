import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notifications.repository';

@Injectable()
export class NotificationService {
    constructor(private readonly notificationRepo: NotificationRepository) {}

    getAll({ page, limit }: { page?: number; limit?: number }, userId: string) {
        if (!page || page <= 0) {
            page = 1;
        }
        if (!limit) {
            limit = 20;
        }

        return this.notificationRepo.findAllAndPaging(
            {
                page,
                limit,
                sort: { created_time: -1 }
            },
            { user: userId }
        );
    }

    async updateReadNotification(id: string, user: any) {
        const filter = { _id: id, user: user._id };

        return this.notificationRepo.updateOne(filter, { read: true });
    }
}
