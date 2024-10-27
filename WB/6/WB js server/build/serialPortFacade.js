"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialPortFacade = void 0;
const serialport_1 = require("serialport");
const serialBus_1 = require("./serialBus");
const rxjs_1 = require("rxjs");
class SerialPortFacade {
    constructor(serialBus, opt) {
        /** очередь комманд на отправку */
        this.commandQueue = [];
        /** последняя команда отправленная в порт  */
        this.sendCommand$ = new rxjs_1.Subject();
        this._lastCommand = null;
        this.serialPort = new serialport_1.SerialPort(opt);
        serialBus.sendData$.subscribe((command) => {
            this.registerCommand(command);
        });
        this.registerSerialPortData();
        this.sendCommand$
            .pipe((0, rxjs_1.filter)(() => { var _a; return !!((_a = this.serialPort) === null || _a === void 0 ? void 0 : _a.isOpen); }), (0, rxjs_1.tap)((command) => (this._lastCommand = command)), (0, rxjs_1.filter)((command) => !!command))
            .subscribe((command) => {
            this.serialPort.write(Buffer.from(command.payload));
            this.runTimeoutWatcher(command);
            if (!command.isNeedAnswer) {
                this.sendCommand$.next(null);
            }
        });
        this.sendCommand$.pipe((0, rxjs_1.filter)((command) => !command)).subscribe(() => {
            this.handleCommandQueue();
        });
    }
    registerSerialPortData() {
        this.serialPort.on('readable', () => {
            const answer = [];
            let chunk;
            while (null !== (chunk = this.serialPort.read(11))) {
                answer.push(...Array.from(chunk));
            }
            if (!answer.length) {
                return;
            }
            // console.log('answer', answer);
            serialBus_1.serialBus.onData$.next(answer);
            this.sendCommand$.next(null);
        });
    }
    /** timeout на последнюю команду (ели небыло ответа то сбрасываем команду и считаем из очреди) */
    runTimeoutWatcher(command) {
        (0, rxjs_1.interval)(1000)
            .pipe((0, rxjs_1.takeUntil)(this.sendCommand$))
            .subscribe(() => {
            this.sendCommand$.next(null);
        });
    }
    /**
     * регистрация команд
     * @param command
     * @returns
     */
    registerCommand(command) {
        if (this.commandQueue.some((c) => c.isEqualCommand(command))) {
            return;
        }
        command.isStatusCommand()
            ? this.commandQueue.push(command)
            : this.commandQueue.unshift(command);
        if (!this._lastCommand) {
            this.handleCommandQueue();
        }
    }
    /** обработка очереди команд */
    handleCommandQueue() {
        const newCommand = this.commandQueue.shift();
        if (!newCommand) {
            return;
        }
        this.sendCommand$.next(newCommand);
    }
}
exports.SerialPortFacade = SerialPortFacade;
//# sourceMappingURL=serialPortFacade.js.map