import { IFRoom } from '../rooms';
import { IFMeeting } from '../meetings';
import { IFDevice } from '../devices';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './../notifications';
import { CestronService } from './../cestron';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventListenerService {
    constructor(
        private readonly cestronService: CestronService,
        private readonly notificationsService: NotificationService
    ) {}

    @OnEvent('device.UpdateValue')
    updateDeviceValue(device: IFDevice) {
        this.cestronService.updateDeviceValueOnCestron(device);
    }

    @OnEvent('meeting.create')
    createMeeting(meeting: IFMeeting) {
        this.cestronService.createAppointmentsWhenCreateMeeting(meeting);
        this.notificationsService.createMany(meeting);
    }

    @OnEvent('meeting.repeat')
    createRepeatMeeting(meeting: IFMeeting) {
        this.cestronService.createAppointmentsWhenCreateMeeting(meeting);
    }

    @OnEvent('meeting.update')
    updateMeeting(meeting: IFMeeting, oldMeeting: IFMeeting) {
        this.notificationsService.createNotificationWhenUpdate(meeting, oldMeeting);
    }

    @OnEvent('room.create')
    createRoom(room: IFRoom) {
        this.cestronService.createRoomOnCestron(room);
    }
}
