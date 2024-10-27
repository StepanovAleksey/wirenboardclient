"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const rxjs_1 = require("rxjs");
const const_1 = require("../const");
const model_1 = require("./model");
const driverCommandBuilder_1 = require("./driverCommandBuilder");
const TOPIC_TEMPLATE = '/devices/curtain_drive/{groupId}/{chanleId}';
class Driver {
    constructor(groupId, chanleId, serialBus, mqqtWbClient) {
        this.groupId = groupId;
        this.chanleId = chanleId;
        this.serialBus = serialBus;
        this.mqqtWbClient = mqqtWbClient;
        /** последний статус мотора штор */
        this.lastDriverStatus$ = new rxjs_1.Subject();
        this.commandBuilder = new driverCommandBuilder_1.DriverCommandBuilder(this.groupId, this.chanleId);
        this.serialBus.subDeviceAnswer$(groupId, chanleId).subscribe((data) => {
            this.lastDriverStatus$.next(data[7]);
        });
        this.updateStatus();
        this.lastDriverStatus$.subscribe((d) => {
            mqqtWbClient.send(`${this.getBaseTopic()}/position`, d);
        });
        this.subCommand();
    }
    sendCommand(command) {
        if (!Object.keys(const_1.ECommandType).includes(command)) {
            return;
        }
        this._writeCommand(new model_1.Command(command, this.commandBuilder.getBufferCommand(command)));
    }
    goToPercent(percent = 0) {
        this._writeCommand(new model_1.Command(const_1.ECommandType.setPercent, this.commandBuilder.getPercentCommand(percent)));
    }
    /** подписка на управляющие команды */
    subCommand() {
        this.mqqtWbClient.subscribe$(`${this.getBaseTopic()}/position/on`).subscribe((payload) => {
            this.goToPercent(JSON.parse(payload));
        });
        this.mqqtWbClient.subscribe$(`${this.getBaseTopic()}/command/on`).subscribe((payload) => {
            this.sendCommand(JSON.parse(payload));
        });
    }
    /** команда на обновление статуса */
    updateStatus() {
        (0, rxjs_1.interval)(500).subscribe(() => {
            this.sendCommand(const_1.ECommandType.statusDriver);
        });
    }
    _writeCommand(command) {
        this.serialBus.sendData$.next(command);
    }
    /** главный топик для устройства */
    getBaseTopic() {
        return TOPIC_TEMPLATE.replace('{groupId}', this.groupId.toString()).replace('{chanleId}', this.chanleId.toString());
    }
}
exports.Driver = Driver;
//# sourceMappingURL=driverModel.js.map