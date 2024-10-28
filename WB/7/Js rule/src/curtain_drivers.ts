declare var trackMqtt: any
declare var dev: any
declare var log: any
declare var defineRule: any
declare var publish: any

/**
 * Матрица соотнесения входов устройств с chanel lavel в драйверах штор. Все драйверы в 1-й группе
 */
const DEVICE_DRIVER_MATRIX: Record<string, number> = {
    "wb-gpio/EXT2_IN1": 1,
    "wb-gpio/EXT2_IN2": 2,
    "wb-gpio/EXT2_IN3": 3,
    "wb-gpio/EXT2_IN4": 4,
    "wb-gpio/EXT2_IN5": 5,
};

enum ECommandRollet {
    up = "up",
    down = 'down',
    stop = 'stop'
}

/**
 * Контейнер для хранения последних команд на утсройство
 */
const CURTAIN_DRIVER_LAST_COMMNAD: Record<number, ECommandRollet> = {}

/**
 * Подписываемся на последную команду упралвения для устройства
 * @param driverChanell 
 */
function trackMqttCurtainDriverCommand(driverChanell: number) {
    trackMqtt(`/devices/curtain_drive/1/${driverChanell}/command/on`, function (message: { topic: string, value: any }) {
        try {
            CURTAIN_DRIVER_LAST_COMMNAD[driverChanell] = JSON.parse(message.value);
        }
        catch (err: any) {
            log.error(`[trackMqttCurtainDriverCommand] error: `, err.message || JSON.stringify(err));
        }
    });
}

/** у нас 16 драйверов, будем слушать все команды которые на них уходят */
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].forEach((v, i) => {
    trackMqttCurtainDriverCommand(i + 1)
})

/**
 * обработка по адресу роллеты
 * @param adressTopic 
 */
function handleAdressTopic(controllerAdressTopic: string, command: ECommandRollet) {
    const driverChanel = DEVICE_DRIVER_MATRIX[controllerAdressTopic];
    if (!driverChanel) {
        log.warning(`[handleAdressTopic]. not fount rollet adress: ${controllerAdressTopic}`);
        return;
    }
    if (CURTAIN_DRIVER_LAST_COMMNAD[driverChanel] === command) {
        sendStopCommand(driverChanel);
        return;
    }
    if (!dev[controllerAdressTopic]) {
        return;
    }
    sendCurtainDriverCommand(driverChanel, command);
}

/**
 * 
 * @param driverChanell Отправка команды
 * @param command 
 */
function sendCurtainDriverCommand(driverChanell: number, command: ECommandRollet) {
    publish(`/devices/curtain_drive/1/${driverChanell}/command/on`, JSON.stringify(command));
}

/**
 * 
 * @param driverChanell Отправка команды на стоп
 */
function sendStopCommand(driverChanell: number) {
    sendCurtainDriverCommand(driverChanell, ECommandRollet.stop);
}

/**
 * Создание правил для "балалайки" адресов и сигналов упарвления
 * @param adressInputTopic  WB адресов сигналов для задания адреса шторы
 * @param upCommandControlTopic  WB адрес сигнала для запуска вперёд
 * @param downCommandControlTopic WB адрес сигнала для запуска назад
 */
function createCurtainMatrix(adressInputTopic: Array<string>, upCommandControlTopic: string, downCommandControlTopic: string) {
    defineRule(`createCurtainMatrix_up_${upCommandControlTopic}`, {
        asSoonAs: function () {
            return dev[upCommandControlTopic];
        },
        then: function (newValue: number, devName: string, cellName: string) {
            adressInputTopic.forEach(topic => {
                handleAdressTopic(topic, ECommandRollet.up)
            });
        }
    });

    defineRule(`createCurtainMatrix_down_${downCommandControlTopic}`, {
        asSoonAs: function () {
            return dev[downCommandControlTopic];
        },
        then: function (newValue: number, devName: string, cellName: string) {
            adressInputTopic.forEach(topic => {
                handleAdressTopic(topic, ECommandRollet.down)
            });
        }
    });
}

createCurtainMatrix(["wb-gpio/EXT2_IN1", "wb-gpio/EXT2_IN2", "wb-gpio/EXT2_IN3", "wb-gpio/EXT2_IN4", "wb-gpio/EXT2_IN5"], "wb-gpio/EXT2_IN6", "wb-gpio/EXT2_IN7");