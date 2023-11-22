"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const rxjs_1 = require("rxjs");
const const_1 = require("../const");
const model_1 = require("./model");
/** класс для фрмирования команды драйвера */
class DriverCommandBuilder {
    constructor(id = 0x00, chanelId = 0, data = 0x00, command = 0x00) {
        this.id = id;
        this.data = data;
        this.command = command;
        this.headCode = 0x9A;
        [this.chanelHi, this.chanelLow] = const_1.CHANNEL_ADRESSES[chanelId];
    }
    getPercentCommand(percent = 0) {
        this.setCommand(const_1.ECommandType.setPercent);
        this.data = percent;
        return [this.headCode, ...this.getChecksumArr(), this.getChecksum()];
    }
    getBufferCommand(commandName) {
        this.setCommand(commandName);
        return [this.headCode, ...this.getChecksumArr(), this.getChecksum()];
    }
    setCommand(commandName) {
        [this.command, this.data] = const_1.SERRIAL_COMMAND_DRIVER_LIST[commandName];
    }
    getChecksumArr() {
        return [this.id, this.chanelHi, this.chanelLow, this.command, this.data];
    }
    getChecksum() {
        return this.getChecksumArr().reduce((result, value) => result ^= value, 0);
    }
}
class Driver {
    constructor(groupId, chanleId, serialBus, mqqtWbClient) {
        this.groupId = groupId;
        this.chanleId = chanleId;
        this.serialBus = serialBus;
        this.mqqtWbClient = mqqtWbClient;
        /** последний статус мотора штор */
        this.lastDriverStatus$ = new rxjs_1.BehaviorSubject(null);
        this.commandBuilder = new DriverCommandBuilder(this.groupId, this.chanleId);
        this.serialBus.subDeviceAnswer$(groupId, chanleId)
            .pipe((0, rxjs_1.tap)((data) => { this.lastDriverStatus$.next(data[7]); }), (0, rxjs_1.switchMap)(() => (0, rxjs_1.timer)(1000)))
            .subscribe(() => {
            this.updateStatus();
        });
        this.updateStatus();
        this.lastDriverStatus$.subscribe(d => {
            mqqtWbClient.send(`/devices/curtain_drive/${groupId}/${chanleId}`, d);
        });
        this.subCommand();
    }
    sendCommand(commandType) {
        this._writeCommand(new model_1.Command(commandType, this.commandBuilder.getBufferCommand(commandType)));
    }
    goToPercent(percent = 0) {
        this._writeCommand(new model_1.Command(const_1.ECommandType.setPercent, this.commandBuilder.getPercentCommand(percent)));
    }
    subCommand() {
        this.mqqtWbClient.subscribe$(`/devices/curtain_drive/${this.groupId}/${this.chanleId}/drive`).pipe((0, rxjs_1.filter)(payload => Object.keys(const_1.ECommandType).includes(payload)))
            .subscribe(payload => {
            this.sendCommand(payload);
        });
    }
    updateStatus() {
        this.sendCommand(const_1.ECommandType.statusDriver);
        (0, rxjs_1.interval)(500).pipe((0, rxjs_1.takeUntil)(this.lastDriverStatus$.pipe((0, rxjs_1.skip)(1)))).subscribe(() => {
            this.sendCommand(const_1.ECommandType.statusDriver);
        });
    }
    _writeCommand(command) {
        this.serialBus.sendData$.next(command);
    }
}
exports.Driver = Driver;
//# sourceMappingURL=driverModel.js.map