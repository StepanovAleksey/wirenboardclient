import { SerialPort } from 'serialport'
import { serialBus } from './serialBus';
import { Command } from './models/model';
import { BehaviorSubject, debounceTime, filter, skip, tap, timer } from 'rxjs';

export const serialPort = new SerialPort({ path: '/dev/ttyRS485-1', baudRate: 2400, dataBits: 8, stopBits: 1 });

/** очередь комманд на отправку */
const commandQueue: Array<Command> = [];

/** последняя команда отправленная в порт  */
const lastSendCommand$ = new BehaviorSubject<Command>(null)

/** timeout на последнюю команду (ели небыло ответа то сбрасываем команду и считаем из очреди) */
lastSendCommand$.pipe(
    tap(command => {
        if (command && !command.isNeedAnswer) {
            lastSendCommand$.next(null);
            handleCommandQueue();
        }
    }),
    debounceTime(1000)
).subscribe(() => {
    lastSendCommand$.next(null);
    handleCommandQueue();
})

serialPort.on('data', function (data: Buffer) {
    lastSendCommand$.next(null);
    const answer = Array.from(data);
    serialBus.onData$.next(answer);
    handleCommandQueue();
});

serialBus.sendData$.subscribe(command => {
    registerCommand(command);
})

/**
 * регистрация команд
 * @param command 
 * @returns 
 */
function registerCommand(command: Command) {
    if (commandQueue.some(c => c.isEqualCommand(command))) {
        return;
    }
    command.isStatusCommand() ?
        commandQueue.push(command) : commandQueue.unshift(command);
    handleCommandQueue();
}

/** обработка очереди команд */
function handleCommandQueue() {
    const newCommand = commandQueue.shift()
    if (!newCommand) {
        return;
    }
    if (!!lastSendCommand$.value) {
        /** возвращаем команду обратно в очередь */
        commandQueue.unshift(newCommand);
        return;
    }
    lastSendCommand$.next(newCommand);
    serialPort.write(Buffer.from(newCommand.payload));
}


