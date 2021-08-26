import * as eventsLib from "events";

export const eventEmitter = new eventsLib.EventEmitter();

export function eventEmit(type, data) {
    eventEmitter.emit(type, data)
}