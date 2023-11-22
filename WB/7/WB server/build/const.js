"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_IS_NEED_ANSWER = exports.CHANNEL_ADRESSES = exports.SERRIAL_COMMAND_DRIVER_LIST = exports.ECommandType = void 0;
/** список комманд  */
var ECommandType;
(function (ECommandType) {
    ECommandType["up"] = "up";
    ECommandType["stop"] = "stop";
    ECommandType["down"] = "down";
    ECommandType["dntMovUp"] = "dntMovUp";
    ECommandType["dntMovDown"] = "dntMovDown";
    ECommandType["learn"] = "learn";
    ECommandType["delete"] = "delete";
    ECommandType["setPercent"] = "setPercent";
    /** текущее положение мотора */
    ECommandType["statusDriver"] = "statusDriver";
    /** скорость обмена по RS и тд. */
    ECommandType["optionDriver"] = "optionDriver";
})(ECommandType || (exports.ECommandType = ECommandType = {}));
/**
 * команды в serial порт
 */
exports.SERRIAL_COMMAND_DRIVER_LIST = {
    up: [0x0a, 0xdd],
    stop: [0x0a, 0xcc],
    down: [0x0a, 0xee],
    dntMovUp: [0x0a, 0x0d],
    dntMovDown: [0x0a, 0x0e],
    learn: [0x0a, 0xaa],
    delete: [0x0a, 0xa6],
    setPercent: [0xdd, 0x00],
    statusDriver: [0xcc, 0x00],
    optionDriver: [0xcb, 0xcb],
};
/**
 * адреса каналов для команд
 */
exports.CHANNEL_ADRESSES = {
    0: [0x00, 0x00],
    1: [0x01, 0x00],
    2: [0x02, 0x00],
    3: [0x04, 0x00],
    4: [0x08, 0x00],
    5: [0x10, 0x00],
    6: [0x20, 0x00],
    7: [0x40, 0x00],
    8: [0x80, 0x00],
    9: [0x00, 0x01],
    10: [0x00, 0x02],
    11: [0x00, 0x04],
    12: [0x00, 0x08],
    13: [0x00, 0x10],
    14: [0x00, 0x20],
    15: [0x00, 0x40],
    16: [0x00, 0x80],
};
exports.COMMAND_IS_NEED_ANSWER = {
    [ECommandType.statusDriver]: true
};
//# sourceMappingURL=const.js.map