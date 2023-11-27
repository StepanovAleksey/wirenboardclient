import { BehaviorSubject, filter, interval, skip, switchMap, takeUntil, tap, timer } from 'rxjs';
import { ECommandType } from '../const';
import { SerialBus } from '../serialBus';
import { Command } from './model';
import { IMqttWbClient } from './contracts';
import { DriverCommandBuilder } from './driverCommandBuilder';

export class Driver {
  commandBuilder: DriverCommandBuilder;

  /** последний статус мотора штор */
  lastDriverStatus$ = new BehaviorSubject<number>(null);

  constructor(
    public groupId: number,
    public chanleId: number,
    public serialBus: SerialBus,
    private mqqtWbClient: IMqttWbClient,
  ) {
    this.commandBuilder = new DriverCommandBuilder(this.groupId, this.chanleId);

    this.serialBus
      .subDeviceAnswer$(groupId, chanleId)
      .pipe(
        tap((data) => {
          this.lastDriverStatus$.next(data[7]);
        }),
        switchMap(() => timer(1000)),
      )
      .subscribe(() => {
        this.updateStatus();
      });
    this.updateStatus();

    this.lastDriverStatus$.subscribe((d) => {
      mqqtWbClient.send(`/devices/curtain_drive/${groupId}/${chanleId}`, d);
    });
    this.subCommand();
  }

  sendCommand(commandType: ECommandType) {
    this._writeCommand(new Command(commandType, this.commandBuilder.getBufferCommand(commandType)));
  }

  goToPercent(percent = 0) {
    this._writeCommand(
      new Command(ECommandType.setPercent, this.commandBuilder.getPercentCommand(percent)),
    );
  }

  private subCommand() {
    this.mqqtWbClient
      .subscribe$(`/devices/curtain_drive/${this.groupId}/${this.chanleId}/drive`)
      .pipe(filter((payload) => Object.keys(ECommandType).includes(payload)))
      .subscribe((payload) => {
        this.sendCommand(payload as ECommandType);
      });
  }

  private updateStatus() {
    this.sendCommand(ECommandType.statusDriver);
    interval(500)
      .pipe(takeUntil(this.lastDriverStatus$.pipe(skip(1))))
      .subscribe(() => {
        this.sendCommand(ECommandType.statusDriver);
      });
  }

  private _writeCommand(command: Command) {
    this.serialBus.sendData$.next(command);
  }
}
