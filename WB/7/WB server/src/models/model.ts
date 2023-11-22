import { COMMAND_IS_NEED_ANSWER, ECommandType } from "../const";

/** команды для serial порта */
export class Command {
    get isNeedAnswer() {
        return COMMAND_IS_NEED_ANSWER[this.commandType]
    }

    constructor(
        public commandType: ECommandType,
        public payload: Array<number>) {
    }
    toString() {
        return JSON.stringify({
            command: this.commandType,
            payload: this.payload.map(n => n.toString(16))
        })
    }
    isEqualType(type: ECommandType) {
        return this.commandType === type;
    }
    isEqualTypeCommand(command: Command) {
        return this.isEqualType(command.commandType);
    }
    
    /** сравнение команд */
    isEqualCommand(command: Command) {
        return this.payload.every((v, index) => v === command.payload[index]);
    }

    isStatusCommand() {
        return this.isEqualType(ECommandType.statusDriver);
    }

}