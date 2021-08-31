import {
    forwardRef,
    Inject,
    Injectable
} from '@nestjs/common'
import { DeviceObserver, IFDevice } from '../devices'
import { IFMeeting, MeetingObserver } from '../meetings'
import { MeetingTypeRepository } from '../meeting_type'
import { RoomRepository } from '../rooms'
import { AbstractCestron } from './cestron-abstract'

@Injectable()
export class CestronService extends AbstractCestron implements MeetingObserver, DeviceObserver {

    constructor(
        @Inject(forwardRef(() => RoomRepository))
        private readonly roomRepo: RoomRepository,
        private readonly meetingTypeRepo: MeetingTypeRepository,
    ){
        super()
    }

    async observerNotify(meeting: IFMeeting, type?: string){
        await this.createAppointmentsWhenCreateMeeting(meeting)
    }

    async deviceObserverNotify(device: IFDevice){
        await this.updateDeviceValueOnCestron(device)
    }

    async createAppointmentsWhenCreateMeeting(meeting: IFMeeting){
        try{
            const room = await this.roomRepo.findById(meeting.room)
            const meetingType = await this.meetingTypeRepo.findById(meeting.type)
            
            meeting.cestron_meeting_id = await this.createAppointments({
                cestron_room_id: room.cestron_room_id,
                name: meeting.name,
                note: meeting.note,
                start_time: meeting.start_time,
                end_time: meeting.end_time,
                type_id: meetingType.cestron_action_id,
                type_name: meetingType.name
            })

            meeting.save()
            console.log("create appointment success")
        }
        catch(err){
            console.log(err.message);
        }
    }

    async updateDeviceValueOnCestron(device: IFDevice){
        await this.updateDeviceValue({
            AttributeID: (device.device_type === 1 || device.is_on === true) ? device.cestron_device_id : device.cestron_device_id_off,
            value: (device.device_type === 1) ? device.current_value : device.is_on
        })
    }
}