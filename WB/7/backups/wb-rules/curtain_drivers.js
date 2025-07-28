var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * Матрица соотнесения входов устройств с chanel lavel в драйверах штор.
 * Для "балалайки" т.е. когда входами задаём адреса
 * Все драйверы в 1-й группе
 */
// var DEVICE_DRIVER_MATRIX: Record<string, number> = {
//   "wb-gpio/EXT1_R3A1": 1,
// };
var DEVICE_DRIVER_MATRIX = {
    "wb-gpio/EXT1_IN1": 1,
    "wb-gpio/EXT1_IN2": 2,
    "wb-gpio/EXT1_IN3": 3,
    "wb-gpio/EXT1_IN4": 4,
    "wb-gpio/EXT1_IN5": 5,
    "wb-gpio/EXT1_IN6": 13,
    "wb-gpio/EXT1_IN7": 14,
    "wb-gpio/EXT1_IN8": 15,
    "wb-gpio/EXT1_IN9": 16,
    "wb-gpio/EXT2_IN1": 1,
    "wb-gpio/EXT2_IN2": 2,
    "wb-gpio/EXT2_IN3": 3,
    "wb-gpio/EXT2_IN4": 4,
    "wb-gpio/EXT2_IN5": 5,
    "wb-gpio/EXT2_IN6": 6,
    "wb-gpio/EXT2_IN7": 7,
};
/**
 * список команд для приводов
 */
var ECommandRollet;
(function (ECommandRollet) {
    ECommandRollet["up"] = "up";
    ECommandRollet["down"] = "down";
    ECommandRollet["stop"] = "stop";
})(ECommandRollet || (ECommandRollet = {}));
function getDriverObj(driverChanell) {
    var isMoved = null;
    var lastCommand = null;
    var activeState = null;
    var lastActiveCommand = null;
    trackMqttCurtainDriver(driverChanell, "isMoved", function (payload) {
        /** штора ехала и остановилась */
        if (isMoved === 1 && payload === 0) {
            activeState = ECommandRollet.stop;
        }
        isMoved = payload;
    });
    trackMqttCurtainDriver(driverChanell, "command/lastActiveCommand", function (payload) {
        lastActiveCommand = payload;
    });
    trackMqttCurtainDriver(driverChanell, "command", function (payload) {
        activeState = payload;
        lastCommand = payload;
        if (lastCommand !== ECommandRollet.stop) {
            publish("/devices/curtain_drive/1/".concat(driverChanell, "/command/lastActiveCommand"), JSON.stringify(lastCommand));
        }
    });
    return {
        isMoved: function () {
            return isMoved;
        },
        lastCommand: function () {
            return lastCommand;
        },
        driverChanell: driverChanell,
        lastActiveCommand: function () {
            return lastActiveCommand;
        },
        activeState: function () {
            return activeState;
        },
    };
}
/**
 * Подписываемся на последную команду упралвения для устройства
 * @param driverChanell канал драйвера
 * @param topic топик состояние котрого получаем
 * @param mapa карта для хранения текущей команды
 */
function trackMqttCurtainDriver(driverChanell, topic, callback) {
    trackMqtt("/devices/curtain_drive/1/".concat(driverChanell, "/").concat(topic), function (message) {
        try {
            callback(JSON.parse(message.value));
        }
        catch (err) {
            log.error("[trackMqttCurtainDriver]", err);
        }
    });
}
/**
 * Список всех драйверов штор
 * у нас 16 драйверов, будем слушать все команды которые на них уходят
 */
var CURTAIN_DRIVERS = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
]
    .map(function (v) { return getDriverObj(v); })
    .reduce(function (obj, device) {
    var _a;
    return (__assign(__assign({}, obj), (_a = {}, _a[device.driverChanell] = device, _a)));
}, {});
/**
 * Обработка комманд для 2-х кнопочного управления
 */
function handleDriverCommand(driverChanel, command) {
    var driver = CURTAIN_DRIVERS[driverChanel];
    if (!driver) {
        log.warning("[handleDriverCommand]. not fount rollet adress: ".concat(driverChanel));
        return;
    }
    if (driver.lastCommand() === command) {
        sendStopCommand(driverChanel);
        return;
    }
    sendCurtainDriverCommand(driverChanel, command);
}
/**
 * обработка по адресу роллеты для "балалайки"
 * @param adressTopic
 */
function handleAdressTopic(controllerAdressTopic, command) {
    var driver = CURTAIN_DRIVERS[DEVICE_DRIVER_MATRIX[controllerAdressTopic]];
    if (!driver) {
        log.warning("[handleAdressTopic]. not fount rollet adress: ".concat(controllerAdressTopic));
        return;
    }
    if (driver.lastCommand() === command) {
        sendStopCommand(driver.driverChanell);
        return;
    }
    if (!dev[controllerAdressTopic]) {
        return;
    }
    sendCurtainDriverCommand(driver.driverChanell, command);
}
/**
 *
 * @param driverChanell Отправка команды
 * @param command
 */
function sendCurtainDriverCommand(driverChanell, command) {
    publish("/devices/curtain_drive/1/".concat(driverChanell, "/command/on"), JSON.stringify(command));
}
/**
 *
 * @param driverChanell Отправка команды на стоп
 */
function sendStopCommand(driverChanell) {
    sendCurtainDriverCommand(driverChanell, ECommandRollet.stop);
}
/**
 * Создание правил для "балалайки" адресов и сигналов упарвления
 * @param adressInputTopic  WB адресов сигналов для задания адреса шторы
 * @param upCommandControlTopic  WB адрес сигнала для запуска вперёд
 * @param downCommandControlTopic WB адрес сигнала для запуска назад
 */
function createCurtainMatrix(adressInputTopic, upCommandControlTopic, downCommandControlTopic) {
    defineRule("createCurtainMatrix_up_".concat(upCommandControlTopic), {
        asSoonAs: function () {
            return dev[upCommandControlTopic];
        },
        then: function (newValue, devName, cellName) {
            adressInputTopic.forEach(function (topic) {
                handleAdressTopic(topic, ECommandRollet.up);
            });
        },
    });
    defineRule("createCurtainMatrix_down_".concat(downCommandControlTopic), {
        asSoonAs: function () {
            return dev[downCommandControlTopic];
        },
        then: function (newValue, devName, cellName) {
            adressInputTopic.forEach(function (topic) {
                handleAdressTopic(topic, ECommandRollet.down);
            });
        },
    });
}
/**
 * управление по 2-м кнопкам одним приводом
 * @param param0
 */
function createTwoSignalControl(_a) {
    var driverChanel = _a.driverChanel, upCommandControlTopic = _a.upCommandControlTopic, downCommandControlTopic = _a.downCommandControlTopic;
    defineRule("createTwoSignalControl_up_".concat(upCommandControlTopic), {
        asSoonAs: function () {
            return dev[upCommandControlTopic];
        },
        then: function (newValue, devName, cellName) {
            handleDriverCommand(driverChanel, ECommandRollet.up);
        },
    });
    defineRule("ccreateTwoSignalControl_down_".concat(downCommandControlTopic), {
        asSoonAs: function () {
            return dev[downCommandControlTopic];
        },
        then: function (newValue, devName, cellName) {
            handleDriverCommand(driverChanel, ECommandRollet.down);
        },
    });
}
/**
 * 1-ая балалайка
 */
// createCurtainMatrix(
//   ["wb-gpio/EXT1_R3A1"],
//   "wb-gpio/EXT1_R3A2",
//   "wb-gpio/EXT1_R3A3"
// );
createCurtainMatrix([
    "wb-gpio/EXT1_IN1",
    "wb-gpio/EXT1_IN2",
    "wb-gpio/EXT1_IN3",
    "wb-gpio/EXT1_IN4",
    "wb-gpio/EXT1_IN5",
    "wb-gpio/EXT1_IN6",
    "wb-gpio/EXT1_IN7",
    "wb-gpio/EXT1_IN8",
    "wb-gpio/EXT1_IN9",
], "wb-gpio/EXT1_IN10", "wb-gpio/EXT1_IN11");
/**
 * 2-ая балалайка
 */
createCurtainMatrix([
    "wb-gpio/EXT2_IN1",
    "wb-gpio/EXT2_IN2",
    "wb-gpio/EXT2_IN3",
    "wb-gpio/EXT2_IN4",
    "wb-gpio/EXT2_IN5",
    "wb-gpio/EXT2_IN6",
    "wb-gpio/EXT2_IN7",
], "wb-gpio/EXT2_IN10", "wb-gpio/EXT2_IN11");
/**
 * бассейн
 */
[
   {
     driverChanel: 8,
     upCommandControlTopic: "wb-gpio/EXT3_IN1",
     downCommandControlTopic: "wb-gpio/EXT3_IN2",
   }, {
     driverChanel: 9,
     upCommandControlTopic: "wb-gpio/EXT3_IN3",
     downCommandControlTopic: "wb-gpio/EXT3_IN4",
   },{
     driverChanel: 10,
     upCommandControlTopic: "wb-gpio/EXT3_IN5",
     downCommandControlTopic: "wb-gpio/EXT3_IN6",
   },
].forEach(createTwoSignalControl);
//#region Спальня, Чайная, Кабинет
function createToggleSignalControl(driverChanel, toggleControl) {
    defineRule("createToggleSignalControl_".concat(toggleControl), {
        asSoonAs: function () {
            return dev[toggleControl];
        },
        then: function (newValue, devName, cellName) {
            var driver = CURTAIN_DRIVERS[driverChanel];
            if (!driver) {
                log.warning("[handleDriverCommand]. not fount rollet adress: ".concat(driverChanel));
                return;
            }
            if (driver.activeState() !== ECommandRollet.stop) {
                sendStopCommand(driverChanel);
                return;
            }
            var prevCommand = driver.lastActiveCommand();
            var nextCommand = prevCommand === ECommandRollet.up
                ? ECommandRollet.down
                : ECommandRollet.up;
            sendCurtainDriverCommand(driverChanel, nextCommand);
        },
    });
}
[
    { driverChanel: 11, toggleControl: "wb-gpio/EXT1_IN12" },
    { driverChanel: 12, toggleControl: "wb-gpio/EXT1_IN13" },
    { driverChanel: 15, toggleControl: "wb-gpio/EXT1_IN14" },
    { driverChanel: 13, toggleControl: "wb-gpio/EXT2_IN12" },
    { driverChanel: 14, toggleControl: "wb-gpio/EXT2_IN13" },
    { driverChanel: 16, toggleControl: "wb-gpio/EXT2_IN14" },
].forEach(function (p) { return createToggleSignalControl(p.driverChanel, p.toggleControl); });
//#endregion
 