import { IFMeeting } from "./interface";

export interface MeetingSubject {
    // Attach an observer to the subject.
    attach(observer: MeetingObserver): void;

    // Detach an observer from the subject.
    detach(observer: MeetingObserver): void;

    // Notify all observers about an event.
    notify(meeting: IFMeeting): void;
}

export interface MeetingObserver {
    // Receive update from subject.
    observerNotify(meeting: IFMeeting): void;
}