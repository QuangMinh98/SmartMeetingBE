import { IFResponse } from "./interface";

export class ResponseService {

    getResponse<T>(data: T[], totalRecords: number, page: number, limit: number): IFResponse<T>{
        return {
            data: data,
            meta_data: {
                total_records: totalRecords,
                page,
                limit,
                total_page: Math.ceil(totalRecords / Number(limit))
            }
        }
    }

}