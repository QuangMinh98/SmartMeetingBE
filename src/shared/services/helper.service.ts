import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
    unixTimeToLocaleDateString(time: number): string {
        return new Date(time).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    }

    startTimeAndEndTimeToString(start_time: number, end_time: number): string {
        const TIMEZONE = 'Asia/Ho_Chi_Minh';

        return `${new Date(start_time).toLocaleDateString('vi-VN', {
            timeZone: TIMEZONE
        })} ${new Date(start_time).toLocaleTimeString('vi-VN', {
            timeZone: TIMEZONE
        })} - ${new Date(end_time).toLocaleTimeString('vi-VN', { timeZone: TIMEZONE })}`;
    }
}
