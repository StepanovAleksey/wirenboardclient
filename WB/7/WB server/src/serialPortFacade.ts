import { SerialPort, SerialPortOpenOptions } from 'serialport';
import { SerialBus, serialBus } from './serialBus';
import { Command } from './models/model';
import { Subject, filter, interval, takeUntil, tap, timer } from 'rxjs';

export class SerialPortFacade {
  private serialPort: SerialPort;

  /** очередь комманд на отправку */
  commandQueue: Array<Command> = [];

  /** последняя команда отправленная в порт  */
  sendCommand$ = new Subject<Command>();

  _lastCommand: Command = null;

  constructor(serialBus: SerialBus, opt: SerialPortOpenOptions<any>) {
    this.serialPort = new SerialPort(opt);

    serialBus.sendData$.subscribe((command) => {
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
        this.serialPort.write(Buffer.from(command.payload));
        this.runTimeoutWatcher(command);
        if (!command.isNeedAnswer) {
          this.sendCommand$.next(null);
        }
      });

    this.sendCommand$.pipe(filter((command) => !command)).subscribe(() => {
      this.handleCommandQueue();
    });
  }

  private registerSerialPortData() {
    this.serialPort.on('readable', () => {
      const answer: number[] = [];
      let chunk: Buffer;
      while (null !== (chunk = this.serialPort.read(11))) {
        answer.push(...Array.from(chunk));
      }
      if (!answer.length) {
        return;
      }
      // console.log('answer', answer);
      serialBus.onData$.next(answer);
      this.sendCommand$.next(null);
    });
  }

  /** timeout на последнюю команду (ели небыло ответа то сбрасываем команду и считаем из очреди) */
  private runTimeoutWatcher(command: Command) {
    interval(1000)
      .pipe(takeUntil(this.sendCommand$))
      .subscribe(() => {
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
