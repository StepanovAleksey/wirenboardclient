interface IValueChange<T> {
  key: string;
  value: T;
}

export interface IProgramOption {
  startTime: string;
  workTime: number;
}

export interface IPrograms extends Record<string, Array<IProgramOption>> {}

export interface IProgramChange extends IValueChange<Array<IProgramOption>> {}

export enum Days {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

export const DaysName: Record<Days, string> = {
  [Days.Monday]: 'Понедельник',
  [Days.Tuesday]: 'Вторник',
  [Days.Wednesday]: 'Среда',
  [Days.Thursday]: 'Четверг',
  [Days.Friday]: 'Пятница',
  [Days.Saturday]: 'Суббота',
  [Days.Sunday]: 'Воскресенье',
};

export const daysArr = [
  Days.Monday,
  Days.Tuesday,
  Days.Wednesday,
  Days.Thursday,
  Days.Friday,
  Days.Saturday,
  Days.Sunday,
];

/** расписание для узла */
export interface IStation extends Record<Days, string> {}

export interface IStationChange extends IValueChange<IStation> {}

/** расписание для узлов */
export interface IStations extends Record<string, IStation> {}

export interface IOption {
  /** датчик дождя */
  rainDetector: boolean;

  /** датчик температуры */
  tempDetector: boolean;

  /** нижний порог срабатывания по температуре */
  tempLow: number;

  /** верхний порог срабатывания по температуре */
  tempHight: number;

  /** коэфициент времени */
  timeRatio: number;
}
export interface IControlSetting {
  deviceName: string;
  control: string;
}
export interface IZoneTopicSettings extends Record<string, IControlSetting> {}
