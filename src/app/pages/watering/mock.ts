import { Days, IOption, IProgram } from './model';

export const mockProgram: IProgram[] = [
  {
    name: 'A',
    options: [
      { startTime: '14:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
    ],
  },
  {
    name: 'B',
    options: [
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
    ],
  },
  {
    name: 'C',
    options: [
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
      { startTime: '00:00', workTime: 20 },
    ],
  },
];

function initStation(obj) {
  for (let station in obj) {
    obj[station] = obj[station] || {};
    for (let day in Days) {
      obj[station][day] = null;
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
