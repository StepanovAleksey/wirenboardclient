import { Observable, Subject, catchError, filter, interval, map, of, tap } from 'rxjs';
import { ECommandType } from '../const';
import { SerialBus } from '../serialBus';
import { Command } from './model';
import { IMqttWbClient } from './contracts';
import { DriverCommandBuilder } from './DriverCommandBuilder';

const TOPIC_TEMPLATE = '/devices/curtain_drive/{groupId}/{chanleId}';

/***
 * Модель для работы с драйвером штор
 * Автоматически подписыывется на serial порт и шлёт запросы на статус
 * Упрвление происходит через топики MQTT
 * Пример отрпавки команды на включение для драйвера group=1, chanel=1:
 * /devices/curtain_drive/1/1/command/on
 * в это ттопик надо записать команду из списка:ECommandType, в JSON формате т.е.
 * /devices/curtain_drive/1/1/command/on -> "up"
 *
 * Управление позицией шторы происходит через топик /devices/curtain_drive/1/1/position/on
 */
export class Driver {
  commandBuilder: DriverCommandBuilder;

  /** последнееизвестное положение мотора штор  0-100*/
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
      /// по документации 1-ый бит сотояние мотора 0-stop 1-run
      const statusMotor = data[8] & 0x01;
      if (!statusMotor) {
        this.mqqtWbClient.send([this.getBaseTopic(), 'command'].join('/'), ECommandType.stop);
      }
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
    if (percent === null) {
      return;
    }
    this._writeCommand(
      new Command(ECommandType.setPercent, this.commandBuilder.getPercentCommand(percent)),
    );
  }

  /** подписка на управляющие команды */
  private subCommand() {
    this.getTopicPayload$<number>('position').subscribe({
      next: (payload) => {
        this.goToPercent(payload);
        this.registerCommand('position', payload);
      },
      error(err) {
        console.error(`[Driver] error `, err);
      },
    });

    this.getTopicPayload$<ECommandType>('command').subscribe({
      next: (payload: ECommandType) => {
        this.sendCommand(payload);
        this.registerCommand('command', payload);
      },
      error(err) {
        console.error(`[Driver] error `, err);
      },
    });
  }

  private getTopicPayload$<T>(topic: string): Observable<T> {
    return this.mqqtWbClient.subscribe$([this.getBaseTopic(), topic, 'on'].join('/')).pipe(
      map((payload) => JSON.parse(payload)),
      tap((payload) => {
        this.registerCommand(topic, payload);
      }),
      catchError((err) => {
        console.error(`[Driver] err`, err);
        return this.getTopicPayload$(topic);
      }),
      filter((p) => !!p),
    );
  }

  private registerCommand<T>(topic: string, payload: T) {
    this.mqqtWbClient.send([this.getBaseTopic(), topic].join('/'), payload);
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
