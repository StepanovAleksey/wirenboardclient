import { Subject, filter } from "rxjs";
import { Command } from "./models/model";
import { CHANNEL_ADRESSES } from "./const";

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

    /** подписка на ответы устройства с groupId и chanellId */
    subDeviceAnswer$(groupId: number, chanelId: number) {
        const chanelAdress = CHANNEL_ADRESSES[chanelId];
        return this.onData$.pipe(filter(answer => {
            return answer[1] === groupId && answer[2] == chanelAdress[0] && answer[3] == chanelAdress[1]
        }))
    }
}

export const serialBus = new SerialBus();