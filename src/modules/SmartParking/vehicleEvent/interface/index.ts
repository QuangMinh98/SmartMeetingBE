export interface IFVehicleEvent {
    PageIndex: number;
    PageSize: number;
    TotalItem: number;
    TotalPage: number;
    TotalMoney: number;
    ReportInOut_data: IFReportInOut_data[];
}

export interface IFReportInOut_data {
    EventID: string;
    CardName: string;
    PlateNumber: string;
    DateTimeIn: string;
    DateTimeOut: string;
    Moneys: string;
    CardGroupId: string;
    CardGroupName: string;
    VehicleGroupID: string;
    VehicleGroupName: string;
    CustomerName: string;
    CustomerGroupID: string;
    CustomerGroupName: string;
}
