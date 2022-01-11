import { Module } from '@nestjs/common';
import { EmptySlotModule } from './emptySlots';

@Module({
    imports: [EmptySlotModule],
    providers: [],
    exports: []
})
export class SmartParkingModule {}
