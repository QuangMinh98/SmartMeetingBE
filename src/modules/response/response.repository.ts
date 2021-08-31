import { IFResponse } from "./interface";


export class ResponseRepository {

    getResponse<T>(data: T[], totalRecords: number, page: number, limit: number): IFResponse<T>{
        return {
            data: data,
            meta_data: {
                total_records: totalRecords,
                page: +page,
                limit: +limit,
                total_page: Math.ceil(totalRecords / Number(limit))
            }
        }
    }

}