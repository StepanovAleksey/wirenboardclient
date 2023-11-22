"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const const_1 = require("../const");
/** команды для serial порта */
class Command {
    get isNeedAnswer() {
        return const_1.COMMAND_IS_NEED_ANSWER[this.commandType];
    }
    constructor(commandType, payload) {
        this.commandType = commandType;
        this.payload = payload;
    }
    toString() {
        return JSON.stringify({
            command: this.commandType,
            payload: this.payload.map(n => n.toString(16))
        });
    }
    isEqualType(type) {
        return this.commandType === type;
    }
    isEqualTypeCommand(command) {
        return this.isEqualType(command.commandType);
    }
    /** сравнение команд */
    isEqualCommand(command) {
        return this.payload.every((v, index) => v === command.payload[index]);
    }
    isStatusCommand() {
        return this.isEqualType(const_1.ECommandType.statusDriver);
    }
}
exports.Command = Command;
//# sourceMappingURL=model.js.map