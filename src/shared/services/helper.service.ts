import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
    unixTimeToLocaleDateString(time: number, options?: { locale: string; timeZone?: string }): string {
        return new Date(time).toLocaleDateString(options.locale, { timeZone: options.timeZone });
    }

    unixTimeToLocaleTimeString(time: number, options?: { locale: string; timeZone?: string }): string {
        return new Date(time).toLocaleTimeString(options.locale, { timeZone: options.timeZone });
    }

    startTimeAndEndTimeToString(start_time: number, end_time: number): string {
        const LOCALE = 'vi-VN';
        const TIMEZONE = 'Asia/Ho_Chi_Minh';

        return `${this.unixTimeToLocaleDateString(start_time, {
            locale: LOCALE,
            timeZone: TIMEZONE
        })} ${this.unixTimeToLocaleTimeString(start_time, {
            locale: LOCALE,
            timeZone: TIMEZONE
        })} - ${this.unixTimeToLocaleTimeString(end_time, { locale: LOCALE, timeZone: TIMEZONE })}`;
    }
}
