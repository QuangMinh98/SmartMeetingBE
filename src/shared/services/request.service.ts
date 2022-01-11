import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class RequestService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create();
        this.axiosInstance.defaults.timeout = 2500;
    }

    async post({ url, headers, body }: { url: string; headers?: any; body?: any }) {
        try {
            const response = await axios.request({
                method: 'POST',
                url,
                headers,
                data: body
            });
            return response;
        } catch (err) {
            return err.response;
        }
    }

    async get({ url, headers }: { url: string; headers: any }) {
        try {
            const response = await axios.request({
                method: 'GET',
                url,
                headers
            });
            return response;
        } catch (err) {
            return err;
        }
    }
}
