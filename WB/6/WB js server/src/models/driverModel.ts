import { Subject, interval } from 'rxjs';
import { ECommandType } from '../const';
import { SerialBus } from '../serialBus';
import { Command } from './model';
import { IMqttWbClient } from './contracts';
import { DriverCommandBuilder } from './driverCommandBuilder';

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
    if (percent === null) {
      return;
    }
    this._writeCommand(
      new Command(ECommandType.setPercent, this.commandBuilder.getPercentCommand(percent)),
    );
  }

  /** подписка на управляющие команды */
  private subCommand() {
    this.mqqtWbClient.subscribe$(`${this.getBaseTopic()}/position/on`).subscribe((payload) => {
      try {
        this.goToPercent(JSON.parse(payload));
      } catch (err: any) {
        console.warn(`[Driver][mqqtWbClient.subscribe$]. Ошибка по топику :${`${this.getBaseTopic()}/position/on`}. payload:${JSON.stringify(payload)}. error: ${err.message || JSON.stringify(err)}`)
      }
    });

    this.mqqtWbClient.subscribe$(`${this.getBaseTopic()}/command/on`).subscribe((payload) => {
      try {
        this.sendCommand(JSON.parse(payload));
      } catch (err: any) {
        console.warn(`[Driver][mqqtWbClient.subscribe$]. Ошибка по топику :${`${this.getBaseTopic()}/command/on`}. payload:${JSON.stringify(payload)}. error: ${err.message || JSON.stringify(err)}`)
      }
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
