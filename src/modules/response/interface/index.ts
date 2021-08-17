export interface IFResponse<T>{
    data: T[]
    meta_data: {
        total_records: number
        limit: number
        page: number
        total_page: number
    }
}