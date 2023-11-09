import { BehaviorSubject, Subject, debounceTime, interval, skip, switchMap, takeUntil, tap, timer } from 'rxjs';
import { CHANNEL_ADRESSES, ECommandType, SERRIAL_COMMAND_DRIVER_LIST } from '../const';
import { SerialBus } from '../serialBus';
import { Command } from './model';


/** класс для фрмирования команды драйвера */
class DriverCommandBuilder {
    headCode = 0x9A;
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
        return this.getChecksumArr().reduce((result, value) => result ^= value, 0)
    }

}

export class Driver {
    commandBuilder: DriverCommandBuilder;
    lastDriverStatus$ = new BehaviorSubject<number>(null);

    constructor(
        public groupId: number,
        public chanleId: number,
        public serialBus: SerialBus) {
        this.commandBuilder = new DriverCommandBuilder(this.groupId, this.chanleId);

        this.serialBus.onData$
            .pipe(
                tap((data) => { this.lastDriverStatus$.next(data[7]); }),
                switchMap(() => timer(300))
            )
            .subscribe(() => {
                this.updateStatus();
            });
        this.updateStatus();
    }


    sendCommand(commandType: ECommandType) {
        this._writeCommand(new Command(commandType, this.commandBuilder.getBufferCommand(commandType)));
    }

    goToPercent(percent = 0) {
        this._writeCommand(new Command(ECommandType.setPercent, this.commandBuilder.getPercentCommand(percent)));
    }

    private updateStatus() {
        this.sendCommand(ECommandType.statusDriver);
        interval(500).pipe(takeUntil(this.lastDriverStatus$.pipe(skip(1)))).subscribe(() => {
            this.sendCommand(ECommandType.statusDriver);
        })
    }

    private _writeCommand(command: Command) {
        this.serialBus.sendData$.next(command);
    }
}