export interface IProgramOption {
  startTime: string;
  workTime: number;
}

export interface IProgram {
  name;
  options: IProgramOption[];
}

export enum Days {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
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
