import { IFDevice } from 'src/modules/devices';
import { IFMeeting } from 'src/modules/meetings';
import { IFRoom } from 'src/modules/rooms';

export interface ISubscription {
    meeting?: IFMeeting;
    device?: IFDevice;
    room?: IFRoom;
    old_meeting?: IFMeeting;
}

export interface Subject {
    // Attach an observer to the subject.
    attach(observer: Observer): void;

    // Detach an observer from the subject.
    detach(observer: Observer): void;

    // Notify all observers about an event.
    notify(object: ISubscription, type?: string): void;
}

export interface Observer {
    // Receive update from subject.
    observerNotify(object: ISubscription, type?: string): void;
}
