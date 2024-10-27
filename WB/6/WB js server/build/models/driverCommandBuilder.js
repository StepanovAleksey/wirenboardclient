"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverCommandBuilder = void 0;
const const_1 = require("../const");
/** класс для фрмирования команды драйвера */
class DriverCommandBuilder {
    constructor(id = 0x00, chanelId = 0, data = 0x00, command = 0x00) {
        this.id = id;
        this.data = data;
        this.command = command;
        this.headCode = 0x9a;
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
        return this.getChecksumArr().reduce((result, value) => (result ^= value), 0);
    }
}
exports.DriverCommandBuilder = DriverCommandBuilder;
//# sourceMappingURL=driverCommandBuilder.js.map