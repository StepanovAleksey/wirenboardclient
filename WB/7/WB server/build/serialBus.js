"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialBus = exports.SerialBus = void 0;
const rxjs_1 = require("rxjs");
const const_1 = require("./const");
class SerialBus {
    constructor() {
        /**
         * сообщения от RS485
         */
        this.onData$ = new rxjs_1.Subject();
        /**
         * сообщения в RS485
         */
        this.sendData$ = new rxjs_1.Subject();
        /**
         * ошибка
         */
        this.error$ = new rxjs_1.Subject();
        /**
         * отмена команды
         */
        this.cancelCommand$ = new rxjs_1.Subject();
    }
    /** подписка на ответы устройства с groupId и chanellId */
    subDeviceAnswer$(groupId, chanelId) {
        const chanelAdress = const_1.CHANNEL_ADRESSES[chanelId];
        return this.onData$.pipe((0, rxjs_1.filter)(answer => {
            return answer[1] === groupId && answer[2] == chanelAdress[0] && answer[3] == chanelAdress[1];
        }));
    }
}
exports.SerialBus = SerialBus;
exports.serialBus = new SerialBus();
//# sourceMappingURL=serialBus.js.map