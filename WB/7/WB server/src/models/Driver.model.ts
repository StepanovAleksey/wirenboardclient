import {
  Observable,
  Subject,
  catchError,
  filter,
  interval,
  map,
  of,
  tap,
  throttleTime,
} from 'rxjs';
import { ECommandType } from '../const';
import { SerialBus } from '../serialBus';
import { Command, EDeviceDelimiterSerial } from './model';
import { IMqttWbClient } from './contracts';
import { DriverCommandBuilder } from './DriverCommandBuilder.model';

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

  /// по документации 1-ый бит сотояние мотора 0-stop 1-run
  isMoved$ = new Subject<number>();

  constructor(
    public groupId: number,
    public chanleId: number,
    public serialBus: SerialBus,
    private mqqtWbClient: IMqttWbClient,
    private deviceDelimiterSerial: EDeviceDelimiterSerial,
  ) {
    this.commandBuilder = new DriverCommandBuilder(this.groupId, this.chanleId);

    this.serialBus.subDeviceAnswer$(groupId, chanleId).subscribe((data) => {
      this.lastDriverStatus$.next(data[7]);
      /// по документации 1-ый бит сотояние мотора 0-stop 1-run
      this.isMoved$.next(data[8] & 0x01);
    });

    this.updateStatus();

    this.lastDriverStatus$.subscribe((d) => {
      mqqtWbClient.send(`${this.getBaseTopic()}/position`, d);
    });

    this.isMoved$.subscribe((isMoved) => {
      this.mqqtWbClient.send([this.getBaseTopic(), 'isMoved'].join('/'), isMoved);
    });

    this.subCommand();
  }

  sendCommand(command: ECommandType) {
    if (!Object.keys(ECommandType).includes(command)) {
      return;
    }
    this._writeCommand(
      new Command(
        command,
        this.commandBuilder.getBufferCommand(command),
        this.deviceDelimiterSerial,
      ),
    );
  }

  goToPercent(percent = 0) {
    if (percent === null) {
      return;
    }
    this._writeCommand(
      new Command(
        ECommandType.setPercent,
        this.commandBuilder.getPercentCommand(percent),
        this.deviceDelimiterSerial,
      ),
    );
  }

  /** подписка на управляющие команды */
  private subCommand() {
    this.getTopicPayload$<number>('position').subscribe({
      next: (payload) => {
        this.goToPercent(payload);
      },
      error(err) {
        console.error(`[Driver] error `, err);
      },
    });

    this.getTopicPayload$<ECommandType>('command')
      .pipe(
        tap((payload) => {
          this.registerCommand('command', payload);
        }),
      )
      .subscribe({
        next: (payload: ECommandType) => {
          this.sendCommand(payload);
        },
        error(err) {
          console.error(`[Driver] error `, err);
        },
      });
  }

  private getTopicPayload$<T>(topic: string): Observable<T> {
    return this.mqqtWbClient.subscribe$([this.getBaseTopic(), topic, 'on'].join('/')).pipe(
      map((payload) => JSON.parse(payload)),
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
    interval(5 * 1000).subscribe(() => {
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
