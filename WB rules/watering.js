var subTopic = '/ui-client/sub';
var pubTopic = '/ui-client/pub';

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
  /** изменение станций */
  stationChange: 'stationChange',
  /** изменение програмы */
  programChange: 'programChange',
};

/** команды на UI */
var commandPubNames = {
  /** все станции */
  stationsRes: 'stationsRes',
  /** все программы */
  programsRes: 'programsRes',
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
var options;

/** сохранение станций */
function saveSation() {
  wateringStorage['stations'] = JSON.stringify(stations);
}

/** сохранение станций */
function savePrograms() {
  wateringStorage['programs'] = JSON.stringify(programs);
}

/** проверка на наличие сохранённых станций в flash памяти */
if (wateringStorage['stations']) {
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
if (wateringStorage['programs']) {
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

stations = JSON.parse(wateringStorage['stations']);
programs = JSON.parse(wateringStorage['programs']);

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
    case commandSubNames.stationChange:
      stations[payload.key] = payload.value;
      saveSation();
      break;
    case commandSubNames.programChange:
      programs[payload.key] = payload.value;
      savePrograms();
      break;
    default:
      break;
  }
});
