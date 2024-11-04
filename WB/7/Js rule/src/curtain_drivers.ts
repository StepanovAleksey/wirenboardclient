declare var trackMqtt: any;
declare var dev: any;
declare var log: any;
declare var defineRule: any;
declare var publish: any;
interface IDevice {
  driverChanell: number;
  isMoved: () => number;

  /**
   * Последняя зарегестрированная команда
   */
  lastCommand: () => ECommandRollet;

  /**
   * последняя активаня команда "не стоп"
   */
  lastActiveCommand: () => ECommandRollet;
}
/**
 * Матрица соотнесения входов устройств с chanel lavel в драйверах штор.
 * Для "балалайки" т.е. когда входами задаём адреса
 * Все драйверы в 1-й группе
 */
var DEVICE_DRIVER_MATRIX: Record<string, number> = {
  "wb-gpio/EXT1_R3A1": 1,
};
// const DEVICE_DRIVER_MATRIX: Record<string, number> = {
//   "wb-gpio/EXT1_IN1": 1,
//   "wb-gpio/EXT1_IN2": 2,
//   "wb-gpio/EXT1_IN3": 3,
//   "wb-gpio/EXT1_IN4": 4,
//   "wb-gpio/EXT1_IN5": 5,
//   "wb-gpio/EXT1_IN6": 13,
//   "wb-gpio/EXT1_IN7": 14,
//   "wb-gpio/EXT1_IN8": 15,
//   "wb-gpio/EXT1_IN9": 16,
//   "wb-gpio/EXT2_IN1": 1,
//   "wb-gpio/EXT2_IN2": 2,
//   "wb-gpio/EXT2_IN3": 3,
//   "wb-gpio/EXT2_IN4": 4,
//   "wb-gpio/EXT2_IN5": 5,
//   "wb-gpio/EXT2_IN6": 6,
//   "wb-gpio/EXT2_IN7": 7,
// };

/**
 * список команд для приводов
 */
enum ECommandRollet {
  up = "up",
  down = "down",
  stop = "stop",
}

function getDriverObj(driverChanell: number): IDevice {
  let isMoved: number = null;

  let lastCommand: ECommandRollet = null;

  let lastActiveCommand: ECommandRollet = null;

  trackMqttCurtainDriver(driverChanell, "isMoved", (payload: number) => {
    isMoved = payload;
  });

  trackMqttCurtainDriver(
    driverChanell,
    "command/lastActiveCommand",
    (payload: ECommandRollet) => {
      lastActiveCommand = payload;
    }
  );

  trackMqttCurtainDriver(
    driverChanell,
    "command/on",
    (payload: ECommandRollet) => {
      lastCommand = payload;
      if (lastCommand !== ECommandRollet.stop) {
        publish(
          `/devices/curtain_drive/1/${driverChanell}/command/lastActiveCommand`,
          JSON.stringify(lastCommand)
        );
      }
    }
  );

  return {
    isMoved() {
      return isMoved;
    },
    lastCommand() {
      return lastCommand;
    },
    driverChanell,
    lastActiveCommand() {
      return lastActiveCommand;
    },
  };
}

/**
 * Подписываемся на последную команду упралвения для устройства
 * @param driverChanell канал драйвера
 * @param topic топик состояние котрого получаем
 * @param mapa карта для хранения текущей команды
 */
function trackMqttCurtainDriver(
  driverChanell: number,
  topic: string,
  callback: (payload: any) => void
) {
  trackMqtt(
    `/devices/curtain_drive/1/${driverChanell}/${topic}`,
    (message: { topic: string; value: any }) => {
      try {
        callback(JSON.parse(message.value));
      } catch (err) {
        log.error("[trackMqttCurtainDriver]", err);
      }
    }
  );
}

/**
 * Список всех драйверов штор
 * у нас 16 драйверов, будем слушать все команды которые на них уходят
 */
const CURTAIN_DRIVERS: Record<number, IDevice> = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
]
  .map((v) => getDriverObj(v))
  .reduce((obj, device) => ({ ...obj, [device.driverChanell]: device }), {});

/**
 * Обработка комманд для 2-х кнопочного управления
 */
function handleDriverCommand(driverChanel: number, command: ECommandRollet) {
  const driver = CURTAIN_DRIVERS[driverChanel];
  if (!driver) {
    log.warning(
      `[handleDriverCommand]. not fount rollet adress: ${driverChanel}`
    );
    return;
  }
  if (driver.lastCommand() !== ECommandRollet.stop) {
    sendStopCommand(driverChanel);
    return;
  }
  sendCurtainDriverCommand(driverChanel, command);
}

/**
 * обработка по адресу роллеты для "балалайки"
 * @param adressTopic
 */
function handleAdressTopic(
  controllerAdressTopic: string,
  command: ECommandRollet
) {
  const driver = CURTAIN_DRIVERS[DEVICE_DRIVER_MATRIX[controllerAdressTopic]];
  if (!driver) {
    log.warning(
      `[handleAdressTopic]. not fount rollet adress: ${controllerAdressTopic}`
    );
    return;
  }
  if (driver.isMoved() === 1) {
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
function sendCurtainDriverCommand(
  driverChanell: number,
  command: ECommandRollet
) {
  publish(
    `/devices/curtain_drive/1/${driverChanell}/command/on`,
    JSON.stringify(command)
  );
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
function createCurtainMatrix(
  adressInputTopic: Array<string>,
  upCommandControlTopic: string,
  downCommandControlTopic: string
) {
  defineRule(`createCurtainMatrix_up_${upCommandControlTopic}`, {
    asSoonAs: function () {
      return dev[upCommandControlTopic];
    },
    then: function (newValue: number, devName: string, cellName: string) {
      adressInputTopic.forEach((topic) => {
        handleAdressTopic(topic, ECommandRollet.up);
      });
    },
  });

  defineRule(`createCurtainMatrix_down_${downCommandControlTopic}`, {
    asSoonAs: function () {
      return dev[downCommandControlTopic];
    },
    then: function (newValue: number, devName: string, cellName: string) {
      adressInputTopic.forEach((topic) => {
        handleAdressTopic(topic, ECommandRollet.down);
      });
    },
  });
}

/**
 * управление по 2-м кнопкам одним приводом
 * @param param0
 */
function createTwoSignalControl({
  driverChanel,
  upCommandControlTopic,
  downCommandControlTopic,
}: {
  driverChanel: number;
  upCommandControlTopic: string;
  downCommandControlTopic: string;
}) {
  defineRule(`createTwoSignalControl_up_${upCommandControlTopic}`, {
    asSoonAs: function () {
      return dev[upCommandControlTopic];
    },
    then: function (newValue: number, devName: string, cellName: string) {
      handleDriverCommand(driverChanel, ECommandRollet.up);
    },
  });

  defineRule(`ccreateTwoSignalControl_down_${downCommandControlTopic}`, {
    asSoonAs: function () {
      return dev[downCommandControlTopic];
    },
    then: function (newValue: number, devName: string, cellName: string) {
      handleDriverCommand(driverChanel, ECommandRollet.down);
    },
  });
}
/**
 * 1-ая балалайка
 */
createCurtainMatrix(
  ["wb-gpio/EXT1_R3A1"],
  "wb-gpio/EXT1_R3A2",
  "wb-gpio/EXT1_R3A3"
);

// createCurtainMatrix(
//   [
//     "wb-gpio/EXT1_IN1",
//     "wb-gpio/EXT1_IN2",
//     "wb-gpio/EXT1_IN3",
//     "wb-gpio/EXT1_IN4",
//     "wb-gpio/EXT1_IN5",
//     "wb-gpio/EXT1_IN6",
//     "wb-gpio/EXT1_IN7",
//     "wb-gpio/EXT1_IN8",
//     "wb-gpio/EXT1_IN9",
//   ],
//   "wb-gpio/EXT1_IN10",
//   "wb-gpio/EXT1_IN11"
// );

/**
 * 2-ая балалайка
 */
createCurtainMatrix(
  [
    "wb-gpio/EXT2_IN1",
    "wb-gpio/EXT2_IN2",
    "wb-gpio/EXT2_IN3",
    "wb-gpio/EXT2_IN4",
    "wb-gpio/EXT2_IN5",
    "wb-gpio/EXT2_IN6",
    "wb-gpio/EXT2_IN7",
  ],
  "wb-gpio/EXT2_IN10",
  "wb-gpio/EXT2_IN11"
);

/**
 * бассейн
 */
[
  {
    driverChanel: 1,
    upCommandControlTopic: "wb-gpio/EXT1_R3A4",
    downCommandControlTopic: "wb-gpio/EXT1_R3A5",
  },
].forEach(createTwoSignalControl);

//#region Спальня, Чайная, Кабинет
function createToggleSignalControl(
  driverChanel: number,
  toggleControl: string
) {
  defineRule(`createToggleSignalControl_${toggleControl}`, {
    asSoonAs: function () {
      return dev[toggleControl];
    },
    then: function (newValue: number, devName: string, cellName: string) {
      const driver = CURTAIN_DRIVERS[driverChanel];
      if (!driver) {
        log.warning(
          `[handleDriverCommand]. not fount rollet adress: ${driverChanel}`
        );
        return;
      }
      if (driver.lastCommand() !== ECommandRollet.stop) {
        sendStopCommand(driverChanel);
        return;
      }

      const prevCommand = driver.lastActiveCommand;
      const nextCommand =
        prevCommand() === ECommandRollet.up
          ? ECommandRollet.down
          : ECommandRollet.up;

      sendCurtainDriverCommand(driverChanel, nextCommand);
    },
  });
}
[{ driverChanel: 1, toggleControl: "wb-gpio/EXT1_R3A6" }].forEach((p) =>
  createToggleSignalControl(p.driverChanel, p.toggleControl)
);
//#endregion
