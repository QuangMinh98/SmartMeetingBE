import { Injectable } from '@nestjs/common';
import { IFDevice } from '../devices';
import { IFMeeting } from '../meetings';
import { MeetingTypeRepository } from '../meeting_type';
import { ISubscription } from '../observer';
import { IFRoom, RoomRepository } from '../rooms';
import { ThingworxService } from 'src/shared';

@Injectable()
export class CestronService {
    constructor(
        private readonly roomRepo: RoomRepository,
        private readonly meetingTypeRepo: MeetingTypeRepository,
        private readonly thingworxService: ThingworxService
    ) {}

    /**
     * This method will be called when state change
     */
    async observerNotify({ meeting, device, room }: ISubscription, type?: string) {
        if (!type || type === 'Create Meeting' || type === 'Repeat Meeting')
            await this.createAppointmentsWhenCreateMeeting(meeting);
        if (type === 'Update device value') await this.updateDeviceValueOnCestron(device);
        if (type === 'Create room') await this.createRoomOnCestron(room);
    }

    /**
     * This function to create a new meeting on cestron thingworx and save id of that meeting to @param meeting
     * Get room data and meeting type data from @param meeting
     * Then create a meeting on cestron thingworx with @param meeting, room data and meeting type data
     * Get meeting id on cestron thingworx and save it in @param meeting as field cestron_meeting_id
     */
    async createAppointmentsWhenCreateMeeting(meeting: IFMeeting) {
        try {
            // Get room and meeting data from meeting data
            const room = await this.roomRepo.findById(meeting.room);
            const meetingType = await this.meetingTypeRepo.findById(meeting.type);

            // Create a meeting on cestron thingworx and get id of that meeting
            meeting.cestron_meeting_id = await this.thingworxService.createAppointments({
                cestron_room_id: room.cestron_room_id,
                name: meeting.name,
                note: meeting.note,
                start_time: meeting.start_time,
                end_time: meeting.end_time,
                type_id: meetingType.cestron_action_id,
                type_name: meetingType.name
            });

            meeting.save();
            console.log('create appointment success');
        } catch (err) {
            console.log(err.message);
        }
    }

    /**
     * This function to update device value from @param meeting
     */
    async updateDeviceValueOnCestron(device: IFDevice) {
        await this.thingworxService.updateDeviceValue({
            AttributeID:
                device.device_type === 1 || device.is_on === true
                    ? device.cestron_device_id
                    : device.cestron_device_id_off,
            value: device.device_type === 1 ? device.current_value : device.is_on
        });
    }

    /**
     * This function to create a new room on cestron thingworx and save id of that room to @param room
     */
    async createRoomOnCestron(room: IFRoom) {
        try {
            const cestron_room = await this.thingworxService.createRoom({
                roomName: room.name,
                description: ` Description for ${room.name}`
            });
            room.cestron_room_id = cestron_room.API_Rooms[0].RoomID;
            await room.save();
        } catch (err) {
            console.log(err.message);
        }
    }
}
