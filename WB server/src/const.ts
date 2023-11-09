/** список комманд  */
export enum ECommandType {
    up = 'up',
    stop = 'stop',
    down = 'down',
    dntMovUp = 'dntMovUp',
    dntMovDown = 'dntMovDown',
    learn = 'learn',
    delete = 'delete',
    setPercent = 'setPercent',
    /** текущее положение мотора */
    statusDriver = 'statusDriver',
    /** скорость обмена по RS и тд. */
    optionDriver = 'optionDriver',
}

/**
 * команды в serial порт
 */
export const SERRIAL_COMMAND_DRIVER_LIST: Record<ECommandType, Array<number>> = {
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
}

/**
 * адреса каналов для команд
 */
export const CHANNEL_ADRESSES: Record<number, Array<number>> = {
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
}

export const COMMAND_IS_NEED_ANSWER: Partial<Record<ECommandType, boolean>> = {
    [ECommandType.statusDriver]: true
} 