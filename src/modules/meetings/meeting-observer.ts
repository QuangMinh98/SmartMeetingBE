import { IFMeeting } from "./interface";

export interface MeetingSubject {
    // Attach an observer to the subject.
    attach(observer: MeetingObserver): void;

    // Detach an observer from the subject.
    detach(observer: MeetingObserver): void;

    // Notify all observers about an event.
    notify(meeting: IFMeeting, type?: string): void;
}

export interface MeetingObserver {
    // Receive update from subject.
    observerNotify(meeting: IFMeeting): void;
}

export abstract class AbstractMeetingSubject implements MeetingSubject {

    private observers: MeetingObserver[] = [];

    /**
     * The subscription management methods.
     */
    public attach(observer: MeetingObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }
        this.observers.push(observer);
    }

    public detach(observer: MeetingObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    /**
     * Trigger an update in each subscriber.
     */
    public notify(meeting: IFMeeting, type?: string): void {
        for (const observer of this.observers) {
            if(!type || type === 'Create Meeting') observer.observerNotify(meeting);
        }
    }
}