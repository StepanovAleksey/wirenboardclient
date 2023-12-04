import { Subject, debounceTime, interval, switchMap, takeUntil, tap, timer } from 'rxjs';
import { ECommandType } from '../const';
import { SerialBus } from '../serialBus';
import { Command } from './model';
import { IMqttWbClient } from './contracts';
import { DriverCommandBuilder } from './driverCommandBuilder';

const TOPIC_TEMPLATE = '/devices/curtain_drive/{groupId}/{chanleId}';

export class Driver {
  commandBuilder: DriverCommandBuilder;

  /** последний статус мотора штор */
  lastDriverStatus$ = new Subject<number>();

  constructor(
    public groupId: number,
    public chanleId: number,
    public serialBus: SerialBus,
    private mqqtWbClient: IMqttWbClient,
  ) {
    this.commandBuilder = new DriverCommandBuilder(this.groupId, this.chanleId);

    this.serialBus.subDeviceAnswer$(groupId, chanleId).subscribe((data) => {
      this.lastDriverStatus$.next(data[7]);
    });

    this.updateStatus();

    this.lastDriverStatus$.subscribe((d) => {
      mqqtWbClient.send(`${this.getBaseTopic()}/position`, d);
    });

    this.subCommand();
  }

  sendCommand(command: ECommandType) {
    if (!Object.keys(ECommandType).includes(command)) {
      return;
    }
    this._writeCommand(new Command(command, this.commandBuilder.getBufferCommand(command)));
  }

  goToPercent(percent = 0) {
    this._writeCommand(
      new Command(ECommandType.setPercent, this.commandBuilder.getPercentCommand(percent)),
    );
  }

  /** подписка на управляющие команды */
  private subCommand() {
    this.mqqtWbClient.subscribe$(`${this.getBaseTopic()}/position/on`).subscribe((payload) => {
      this.goToPercent(JSON.parse(payload));
    });

    this.mqqtWbClient.subscribe$(`${this.getBaseTopic()}/command/on`).subscribe((payload) => {
      this.sendCommand(JSON.parse(payload));
    });
  }

  /** команда на обновление статуса */
  private updateStatus() {
    interval(500).subscribe(() => {
      this.sendCommand(ECommandType.statusDriver);
    });
  }

  private _writeCommand(command: Command) {
    this.serialBus.sendData$.next(command);
  }

  /** главный топик для устройства */
  private getBaseTopic() {
    return TOPIC_TEMPLATE.replace('{groupId}', this.groupId.toString()).replace(
      '{chanleId}',
      this.chanleId.toString(),
    );
  }
}
