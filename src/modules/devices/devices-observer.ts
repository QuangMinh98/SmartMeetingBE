import { IFDevice } from "./interface";

export interface DeviceSubject {
    // Attach an observer to the subject.
    attach(observer: DeviceObserver): void;

    // Detach an observer from the subject.
    detach(observer: DeviceObserver): void;

    // Notify all observers about an event.
    notify(device: IFDevice): void;
}

/**
 * The Observer interface declares the update method, used by subjects.
 */
export interface DeviceObserver {
    // Receive update from subject.
    deviceObserverNotify(device: IFDevice): void;
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */
export abstract class AbstractDeviceSubject implements DeviceSubject {

    /**
     * @type {Observer[]} List of subscribers. In real life, the list of
     * subscribers can be stored more comprehensively (categorized by event
     * type, etc.).
     */
    private observers: DeviceObserver[] = [];

    /**
     * The subscription management methods.
     */
    public attach(observer: DeviceObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: DeviceObserver): void {
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
    public notify(device: IFDevice): void {
        for (const observer of this.observers) {
            observer.deviceObserverNotify(device);
        }
    }
}
