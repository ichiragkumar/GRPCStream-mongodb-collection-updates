"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamProductEvents = void 0;
const eventService_1 = require("../eventService");
const streamProductEvents = (call) => {
    const listener = (event) => {
        console.log("u wast emmting it");
        call.write(event);
    };
    eventService_1.productEventEmitter.on('productEvent', listener);
    call.on('cancelled', () => {
        eventService_1.productEventEmitter.removeListener('productEvent', listener);
    });
};
exports.streamProductEvents = streamProductEvents;
