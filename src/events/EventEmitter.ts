/*
    * Usage:
    * import this class and use eventEmitter.emit('update-data', data) to send an event
    * import this class and use eventEmitter.subscribe('update-data', fn) to listen for an event
    * make sure to unsubscribe from the event when the scene ends or component unmounts by calling the function returned by eventEmitter.subscribe
*/

class EventEmitter {
    private events: { [eventName: string]: Function[] };

    constructor() {
        this.events = {};
    }

    public subscribe = (eventName: string, fn: Function): (() => void) => {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
        return () => {
            this.events[eventName] = this.events[eventName].filter(eventFn => eventFn !== fn);
        };
    }

    public emit = (eventName: string, data: GameData): void => {
        const event = this.events[eventName];
        if (event) {
            event.forEach(fn => {
                fn(data);
            });
        }
    }
}

export const eventEmitter = new EventEmitter();
