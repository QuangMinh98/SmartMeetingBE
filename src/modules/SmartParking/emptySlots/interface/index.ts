export interface IFEmptySlot<IF> {
    FloorName: string;
    ID: number;
    EmptySpaces: IF[];
}

export interface IFEmptySlotCar {
    BlockName: string;
    Detail: string[];
}

export interface IFEmptySlotMoto {
    BlockName: string;
    EmptySlot: number;
}
