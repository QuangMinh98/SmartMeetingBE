interface RoomSubject {
    // Attach an observer to the subject.
    attach(observer: RoomObserver): void;

    // Detach an observer from the subject.
    detach(observer: RoomObserver): void;

    // Notify all observers about an event.
    notify(): void;
}

/**
 * The Observer interface declares the update method, used by subjects.
 */
interface RoomObserver {
    // Receive update from subject.
    update(subject: RoomSubject): void;
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */
export abstract class AbstractRoomSubject implements RoomSubject {
    /**
     * @type {Observer[]} List of subscribers. In real life, the list of
     * subscribers can be stored more comprehensively (categorized by event
     * type, etc.).
     */
    private observers: RoomObserver[] = [];

    /**
     * The subscription management methods.
     */
    public attach(observer: RoomObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: RoomObserver): void {
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
    public notify(): void {
        console.log('Subject: Notifying observers...');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}
