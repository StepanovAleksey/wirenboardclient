import { SerialPort } from 'serialport'
import { serialBus } from './serialBus';
import { Command } from './models/model';

export const serialPort = new SerialPort({ path: '/dev/ttyRS485-1', baudRate: 9600, dataBits: 8, stopBits: 1 });

/** очередь комманд на отправку */
const commandQueue: Array<Command> = [];

/** последняя команда отправленная в порт  */
let lastCommand: Command | null = null;

serialPort.on('data', function (data: Buffer) {
    lastCommand = null;
    serialBus.onData$.next(Array.from(data));
    writeCommand();
});

serialBus.sendData$.subscribe(command => {
    registerCommand(command);
    writeCommand();
})

function registerCommand(command: Command) {
    if (commandQueue.some(c => c.isEqualCommand(command))) {
        return;
    }
    command.isStatusCommand() ?
        commandQueue.push(command) : commandQueue.unshift(command);
}


function writeCommand() {
    const newCommand = commandQueue.shift()
    if (!newCommand) {
        return;
    }
    if (!!lastCommand && newCommand.isStatusCommand()) {
        commandQueue.unshift(newCommand);
        return;
    }
    lastCommand = newCommand.isNeedAnswer ? newCommand : null;
    serialPort.write(Buffer.from(newCommand.payload));
    writeCommand();
}


