export interface IProgramOption {
  startTime: string;
  workTime: number;
}

export interface IProgram {
  name;
  options: IProgramOption[];
}

export const mockProgram: IProgram[] = [
  {
    name: "A",
    options: [
      { startTime: "14:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
    ],
  },
  {
    name: "B",
    options: [
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
    ],
  },
  {
    name: "C",
    options: [
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
      { startTime: "00:00", workTime: 20 },
    ],
  },
];

export enum Days {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export const DaysName: Record<Days, string> = {
  [Days.Monday]: "Понедельник",
  [Days.Tuesday]: "Вторник",
  [Days.Wednesday]: "Среда",
  [Days.Thursday]: "Четверг",
  [Days.Friday]: "Пятница",
  [Days.Saturday]: "Суббота",
  [Days.Sunday]: "Воскресенье",
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
