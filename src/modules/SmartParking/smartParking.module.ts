import { Module } from '@nestjs/common';
import { EmptySlotModule } from './emptySlots';
import { VehicleEventModule } from './vehicleEvent';

@Module({
    imports: [EmptySlotModule, VehicleEventModule],
    providers: [],
    exports: []
})
export class SmartParkingModule {}
