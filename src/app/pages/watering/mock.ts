import { Days, IOption, IPrograms } from './model';

export const mockProgram: IPrograms = {
  A: [
    { startTime: '14:00', workTime: 20 },
    { startTime: null, workTime: 20 },
    { startTime: null, workTime: 20 },
    { startTime: null, workTime: 20 },
  ],
  B: [
    { startTime: '14:00', workTime: 20 },
    { startTime: null, workTime: 20 },
    { startTime: null, workTime: 20 },
    { startTime: null, workTime: 20 },
  ],
  C: [
    { startTime: '14:00', workTime: 20 },
    { startTime: null, workTime: 20 },
    { startTime: null, workTime: 20 },
    { startTime: null, workTime: 20 },
  ],
};

function initStation(obj) {
  for (let station in obj) {
    obj[station] = obj[station] || {};
    for (let day in Days) {
      obj[station][day] = 'A';
    }
  }
  return obj;
}

var stations = {
  'деревья-ели': {},
  'деревья-берёзы': {},
  'газон за домом': {},
  'газон перед домом': {},
  кустарники: {},
  плодовые: {},
  резерв1: {},
  резерв2: {},
};
export const stationsMock = initStation(stations);

export const optionMock: IOption = {
  rainDetector: true,
  tempDetector: true,
  tempHight: 30,
  tempLow: 15,
  timeRatio: 100,
};
