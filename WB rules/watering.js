var subTopic = "/ui-client/sub";
var pubTopic = "/ui-client/pub";

/** команды от UI */
var commandSubNames = {
  /** получить настройки всех станций */
  getStations: "getStations",
};

/** команды на UI */
var commandPubNames = {
  /** получить настройки всех станций */
  stationsRes: "stationsRes",
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

var stations = {
  "деревья-ели": {},
  "деревья-берёзы": {},
  "газон за домом": {},
  "газон перед домом": {},
  кустарники: {},
  плодовые: {},
  резерв1: {},
  резерв2: {},
};

/** инициализация станций */
function initStation(obj) {
  for (station in obj) {
    obj[station] = obj[station] || {};
    for (day in Days) {
      obj[station][day] = "";
    }
  }
}

function sendCommand(commandName, payload) {
  publish(
    pubTopic,
    JSON.stringify({
      name: commandName,
      payload: payload,
    })
  );
}

initStation(stations);

trackMqtt(subTopic, function (message) {
  var command = JSON.parse(message.value);
  switch (command.name) {
    case commandSubNames.getStations:
      sendCommand(commandPubNames.stationsRes, stations);
      break;
    default:
      break;
  }
});
