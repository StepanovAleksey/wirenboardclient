"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialPort = void 0;
const serialport_1 = require("serialport");
const serialBus_1 = require("./serialBus");
const rxjs_1 = require("rxjs");
exports.serialPort = new serialport_1.SerialPort({ path: '/dev/ttyRS485-1', baudRate: 2400, dataBits: 8, stopBits: 1 });
/** очередь комманд на отправку */
const commandQueue = [];
/** последняя команда отправленная в порт  */
const lastSendCommand$ = new rxjs_1.BehaviorSubject(null);
/** послдение данные полученные от порта */
const lastAnswer$ = new rxjs_1.BehaviorSubject(null);
lastSendCommand$.pipe((0, rxjs_1.tap)(command => {
    if (command && !command.isNeedAnswer) {
        lastSendCommand$.next(null);
        handleCommandQueue();
    }
}), (0, rxjs_1.debounceTime)(1000)).subscribe(() => {
    lastSendCommand$.next(null);
    handleCommandQueue();
});
exports.serialPort.on('data', function (data) {
    lastSendCommand$.next(null);
    const answer = Array.from(data);
    serialBus_1.serialBus.onData$.next(answer);
    lastAnswer$.next(answer);
    handleCommandQueue();
});
serialBus_1.serialBus.sendData$.subscribe(command => {
    registerCommand(command);
});
/**
 * регистрация команд
 * @param command
 * @returns
 */
function registerCommand(command) {
    if (commandQueue.some(c => c.isEqualCommand(command))) {
        return;
    }
    command.isStatusCommand() ?
        commandQueue.push(command) : commandQueue.unshift(command);
    handleCommandQueue();
}
/** обработка очереди команд */
function handleCommandQueue() {
    const newCommand = commandQueue.shift();
    if (!newCommand) {
        return;
    }
    if (!!lastSendCommand$.value) {
        /** возвращаем команду обратно в очередь */
        commandQueue.unshift(newCommand);
        return;
    }
    lastSendCommand$.next(newCommand);
    exports.serialPort.write(Buffer.from(newCommand.payload));
}
//# sourceMappingURL=serial.js.map