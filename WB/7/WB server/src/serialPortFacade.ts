import { ByteLengthParser, DelimiterParser, SerialPort, SerialPortOpenOptions } from 'serialport';
import { SerialBus, serialBus } from './serialBus';
import { Command, EDeviceDelimiterSerial } from './models/model';
import { Subject, filter, interval, takeUntil, tap, timer } from 'rxjs';
import { Transform } from 'stream';

export class SerialPortFacade {
  private serialPort: SerialPort;

  /** очередь комманд на отправку */
  commandQueue: Array<Command> = [];

  /** последняя команда отправленная в порт  */
  sendCommand$ = new Subject<Command>();

  _lastCommand: Command = null;

  parser: Transform = null;
  constructor(
    serialBus: SerialBus,
    opt: SerialPortOpenOptions<any>,
    transform: Transform,
    deviceProto: EDeviceDelimiterSerial,
  ) {
    this.serialPort = new SerialPort(opt);

    this.parser = this.serialPort.pipe(transform);

    // this.parser = this.serialPort.pipe(new ByteLengthParser({ length: 10 }));

    serialBus.sendData$
      .pipe(filter((command) => command.deviceVersionProto === deviceProto))
      .subscribe((command) => {
        this.registerCommand(command);
      });

    this.registerSerialPortData();

    this.sendCommand$
      .pipe(
        filter(() => !!this.serialPort?.isOpen),
        tap((command) => (this._lastCommand = command)),
        filter((command) => !!command),
      )
      .subscribe((command) => {
        this.runTimeoutWatcher(command);
        this.serialPort.write(Buffer.from(command.payload), (err) => {
          //console.log('write ', Buffer.from(command.payload));
          this.errorHandle(err);
          if (!command.isNeedAnswer) {
            this.sendCommand$.next(null);
          }
        });
      });

    this.sendCommand$.pipe(filter((command) => !command)).subscribe(() => {
      this.handleCommandQueue();
    });
  }

  private errorHandle(error: any) {
    if (!!error) {
      console.log('[SerialPortFacade]. Error on write: ', error.message);
    }
  }
  private registerSerialPortData() {
    this.parser.on('data', (answer) => {
      //console.log('answer', answer);
      serialBus.onData$.next(answer);
      this.sendCommand$.next(null);
    });

    this.serialPort.on('open', (err) => {
      this.errorHandle(err);
      if (!err) {
        console.log('[SerialPortFacade]. Порт успешно открыт');
      }
    });
  }

  /** timeout на последнюю команду (ели небыло ответа то сбрасываем команду и считаем из очреди) */
  private runTimeoutWatcher(command: Command) {
    interval(1000)
      .pipe(takeUntil(this.sendCommand$))
      .subscribe(() => {
        console.warn('нет ответа ', command);
        this.sendCommand$.next(null);
      });
  }

  /**
   * регистрация команд
   * @param command
   * @returns
   */
  private registerCommand(command: Command) {
    if (this.commandQueue.some((c) => c.isEqualCommand(command))) {
      return;
    }
    command.isStatusCommand()
      ? this.commandQueue.push(command)
      : this.commandQueue.unshift(command);
    if (!this._lastCommand) {
      this.handleCommandQueue();
    }
  }

  /** обработка очереди команд */
  private handleCommandQueue() {
    const newCommand = this.commandQueue.shift();
    if (!newCommand) {
      return;
    }
    this.sendCommand$.next(newCommand);
  }
}
