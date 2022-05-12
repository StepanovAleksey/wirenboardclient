var subTopic = '/ui-client/sub';
var pubTopic = '/ui-client/pub';
var isDebug = true;
/** storage */
var wateringStorage = new PersistentStorage('watering-storage', {
  global: true,
});

/** команды от UI */
var commandSubNames = {
  /** получить настройки всех станций */
  getStations: 'getStations',
  /** получить настройки всех программ */
  getPrograms: 'getPrograms',
  /** получить настройки  */
  getOptions: 'getOptions',
  /** изменение станций */
  stationChange: 'stationChange',
  /** изменение програмы */
  programChange: 'programChange',
  /** изменение опций */
  optionChange: 'optionChange',
};

/** команды на UI */
var commandPubNames = {
  /** все станции */
  stationsRes: 'stationsRes',
  /** все программы */
  programsRes: 'programsRes',
  /** опции */
  optionsRes: 'optionsRes',
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

/** Опции */
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
      }
    }
  };
  var defaultStation = {
    'деревья-ели': {},
    'деревья-берёзы': {},
    'газон за домом': {},
    'газон перед домом': {},
    кустарники: {},
    плодовые: {},
    резерв1: {},
    резерв2: {},
  };
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
    tempLow: null,
    tempHight: null,
    timeRatio: 100,
  };
  saveWateringOptions();
}

stations = JSON.parse(wateringStorage['stations']);
programs = JSON.parse(wateringStorage['programs']);
wateringOptions = JSON.parse(wateringStorage['watering_options']);

/** отправка команд на UI */
function sendCommand(commandName, payload) {
  publish(
    pubTopic,
    JSON.stringify({
      name: commandName,
      payload: payload,
    }),
  );
}

/** отслеживание команд с UI */
trackMqtt(subTopic, function (message) {
  var command = JSON.parse(message.value);
  var payload = command.payload;
  switch (command.name) {
    case commandSubNames.getStations:
      sendCommand(commandPubNames.stationsRes, stations);
      break;
    case commandSubNames.getPrograms:
      sendCommand(commandPubNames.programsRes, programs);
      break;
    case commandSubNames.getOptions:
      sendCommand(commandPubNames.optionsRes, wateringOptions);
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
    default:
      break;
  }
});
