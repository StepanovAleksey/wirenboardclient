import { CHANNEL_ADRESSES, ECommandType, SERRIAL_COMMAND_DRIVER_LIST } from '../const';

/** класс для фрмирования команды драйвера */
export class DriverCommandBuilder {
  headCode = 0x9a;
  chanelHi: number;
  chanelLow: number;
  constructor(public id = 0x00, chanelId = 0, public data = 0x00, public command = 0x00) {
    [this.chanelHi, this.chanelLow] = CHANNEL_ADRESSES[chanelId];
  }

  getPercentCommand(percent = 0) {
    this.setCommand(ECommandType.setPercent);
    this.data = percent;
    return [this.headCode, ...this.getChecksumArr(), this.getChecksum()];
  }

  getBufferCommand(commandName: ECommandType) {
    this.setCommand(commandName);
    return [this.headCode, ...this.getChecksumArr(), this.getChecksum()];
  }

  private setCommand(commandName: ECommandType) {
    [this.command, this.data] = SERRIAL_COMMAND_DRIVER_LIST[commandName];
  }

  private getChecksumArr() {
    return [this.id, this.chanelHi, this.chanelLow, this.command, this.data];
  }

  private getChecksum() {
    return this.getChecksumArr().reduce((result, value) => (result ^= value), 0);
  }
}
