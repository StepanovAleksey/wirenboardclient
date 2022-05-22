var subTopic = '/ui-client/sub';
var pubTopic = '/ui-client/pub';
var isDebug = true;

/** storage */
var wateringStorage = new PersistentStorage('watering-storage', {
  global: true,
});

var zoneRelayTopicsMaps = {
  'деревья-ели': {
    deviceName: 'wb-mr6c_52',
    control: 'K1',
  },
  'деревья-берёзы': {
    deviceName: 'wb-mr6c_52',
    control: 'K2',
  },
  'газон за домом': {
    deviceName: 'wb-mr6c_52',
    control: 'K3',
  },
  'газон перед домом': {
    deviceName: 'wb-mr6c_52',
    control: 'K4',
  },
  кустарники: {
    deviceName: 'wb-mr6c_52',
    control: 'K5',
  },
  плодовые: {
    deviceName: 'wb-mr6c_52',
    control: 'K6',
  },
};

/**
 * конфигурация датчиков
 */
var detectsDevices = {
  temperature: {
    deviceName: 'wb-ms_58',
    control: 'Temperature',
  },
  rain: {
    deviceName: 'wb-mr6c_52',
    control: 'Input 6',
  },
};

/** команды от UI */
var commandSubNames = {
  /** инициализация */
  init: 'init',
  /** изменение станций */
  stationChange: 'stationChange',
  /** изменение програмы */
  programChange: 'programChange',
  /** изменение опций */
  optionChange: 'optionChange',
  /** ручное управление */
  manualSendCommand: 'manualSendCommand',
};

/** команды на UI */
var commandPubNames = {
  /** все станции */
  stationsRes: 'stationsRes',
  /** все программы */
  programsRes: 'programsRes',
  /** опции */
  optionsRes: 'optionsRes',
  /** ответ на заапрос инициализации */
  initRes: 'initRes',
};

var Days = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
};

/** станции */
var stations;

/** программы */
var programs;

/** Опции
 * @type {Object} IWateringOptions
 * @property {boolean} rainDetector - датчик дождя
 * @property {boolean} tempDetector - датчик температуры
 * @property {number} tempLow - нижний порог срабатывания по температуре
 * @property {number} tempHight - верхний порог срабатывания по температуре
 * @property {number} timeRatio -  коэфициент времени 0-100
 */
var wateringOptions;

/** сохранение станций */
function saveSation() {
  wateringStorage['stations'] = JSON.stringify(stations);
}

/** сохранение станций */
function savePrograms() {
  wateringStorage['programs'] = JSON.stringify(programs);
}

/** сохранение станций */
function saveWateringOptions() {
  wateringStorage['watering_options'] = JSON.stringify(wateringOptions);
}

/** проверка на наличие сохранённых станций в flash памяти */
if (isDebug || !wateringStorage['stations']) {
  /** инициализация станций */
  var initStation = function (obj) {
    for (var station in obj) {
      obj[station] = obj[station] || {};
      for (var dayKey in Days) {
        obj[station][Days[dayKey]] = null;
        if (isDebug && Days[dayKey] === Days.Sunday) {
          obj[station][Days[dayKey]] = 'A';
        }
      }
    }
  };
  var defaultStation = Object.keys(zoneRelayTopicsMaps).reduce(function (a, b) {
    a[b] = {};
    return a;
  }, {});
  initStation(defaultStation);
  stations = defaultStation;
  saveSation();
}

/** проверка на наличие программ */
if (isDebug || !wateringStorage['programs']) {
  function emptyProgram() {
    return [
      { startTime: null, workTime: 20 },
      { startTime: null, workTime: 20 },
      { startTime: null, workTime: 20 },
      { startTime: null, workTime: 20 },
    ];
  }
  var defaultPrograms = {
    A: emptyProgram(),
    B: emptyProgram(),
    C: emptyProgram(),
  };
  programs = defaultPrograms;
  savePrograms();
}

/** проверка на наличие опций */
if (isDebug || !wateringStorage['watering_options']) {
  wateringOptions = {
    rainDetector: false,
    tempDetector: false,
    tempLow: 10,
    tempHight: 50,
    timeRatio: 100,
  };
  saveWateringOptions();
}

stations = JSON.parse(wateringStorage['stations']);
programs = JSON.parse(wateringStorage['programs']);
wateringOptions = JSON.parse(wateringStorage['watering_options']);

/** отправка команд на UI
 * @param {string} commandName - имя команды
 * @param {any} payload - данные
 */
function sendCommand(commandName, payload) {
  payload = JSON.stringify({
    name: commandName,
    payload: payload,
  });
  publish(pubTopic, payload);
}

/**
 * Управление ручным поливом
 */
var manualCommandWorker = (function () {
  var timers = {};

  /**
   * команада "стоп"
   * @param {string} zoneKey
   */
  var stopFunc = function (zoneKey) {
    var device = zoneRelayTopicsMaps[zoneKey];
    dev[device.deviceName][device.control] = false;
    if (timers[zoneKey]) {
      clearTimeout(timers[zoneKey]);
      timers[zoneKey] = null;
    }
  };

  /**
   * команада "старт"
   * @param {string} zoneKey - ID зоны
   * @param {number} time - время работы
   */
  var startFunc = function (zoneKey, time) {
    var device = zoneRelayTopicsMaps[zoneKey];
    dev[device.deviceName][device.control] = true;
    timers[zoneKey] = setTimeout(function () {
      stopFunc(zoneKey);
    }, time * 1000 * (isDebug ? 1 : 60));
  };

  return {
    Start: startFunc,
    Stop: stopFunc,
  };
})();

/**
 * worker для работы с запуском по расписанию
 */
var timeZoneWorker = (function (programs, manualCommandWorker) {
  /**
   * Проверка датчиков
   * @returns результат проверки
   */
  var chekDetectors = function () {
    var rainControlValue =
      dev[detectsDevices.rain.deviceName][detectsDevices.rain.control];
    var tempControlValue =
      dev[detectsDevices.temperature.deviceName][
        detectsDevices.temperature.control
      ];
    if (wateringOptions.rainDetector && !rainControlValue) {
      return false;
    }
    if (
      wateringOptions.tempDetector &&
      (wateringOptions.tempLow > tempControlValue ||
        wateringOptions.tempHight < tempControlValue)
    ) {
      return false;
    }
    return true;
  };

  /**
   * старт полива
   * @param {string} programKey - ID программы
   * @param {number} timeWork - время работы
   */
  var runRelay = function (programKey, timeWork) {
    if (!chekDetectors()) {
      return;
    }
    var currentDay = new Date().getDay();
    Object.keys(stations).forEach(function (zoneKey) {
      if (stations[zoneKey][currentDay] !== programKey) {
        return;
      }
      timeWork = (timeWork * wateringOptions.timeRatio) / 100;
      manualCommandWorker.Start(zoneKey, timeWork);
    });
  };

  /** запускаем джобу с интервалом 1мин для проверки станций */
  defineRule('crone_1min_interval', {
    when: cron('0 * * * * *'),
    then: function () {
      var curentTime = new Date();
      var currentTimeWork = [
        curentTime.getHours(),
        curentTime.getMinutes(),
      ].join(':');
      Object.keys(programs).forEach(function (programKey) {
        programs[programKey]
          .filter(function (programOption) {
            return programOption.startTime === currentTimeWork;
          })
          .forEach(function (programOption) {
            runRelay(programKey, programOption.workTime);
          });
      });
    },
  });

  return {};
})(programs, manualCommandWorker);

/** отслеживание команд с UI */
trackMqtt(subTopic, function (message) {
  if (isDebug) {
    log('command', message.value);
  }
  var command = JSON.parse(message.value);
  var payload = command.payload;
  switch (command.name) {
    case commandSubNames.init:
      sendCommand(commandPubNames.initRes, {
        stations: stations,
        programs: programs,
        options: wateringOptions,
        zoneRelayTopicsMaps: zoneRelayTopicsMaps,
        detectsDevices: detectsDevices,
      });
      break;
    case commandSubNames.stationChange:
      stations[payload.key] = payload.value;
      saveSation();
      break;
    case commandSubNames.programChange:
      programs[payload.key] = payload.value;
      savePrograms();
      break;
    case commandSubNames.optionChange:
      wateringOptions = payload;
      saveWateringOptions();
    case commandSubNames.manualSendCommand:
      if (typeof manualCommandWorker[payload.commnad] == 'function') {
        manualCommandWorker[payload.commnad](payload.zoneKey, payload.timeSec);
      }
      break;
    default:
      break;
  }
});
