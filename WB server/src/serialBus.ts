import { Subject } from "rxjs";
import { Command } from "./models/model";

export class SerialBus {
    /**
     * сообщения от RS485
     */
    onData$ = new Subject<Array<number>>();

    /** 
     * сообщения в RS485
     */
    sendData$ = new Subject<Command>();


    /**
     * ошибка
     */
    error$ = new Subject();

    /**
     * отмена команды
     */
    cancelCommand$ = new Subject<Command>();
}

export const serialBus = new SerialBus();