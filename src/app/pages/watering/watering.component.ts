import { Component, OnInit } from "@angular/core";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { interval } from "rxjs";
import { map } from "rxjs/operators";

const subTopic = "/ui-client/sub";
const pubTopic = "/ui-client/pub";
enum Days {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

const DaysName: Record<Days, string> = {
  [Days.Monday]: "Понедельник",
  [Days.Tuesday]: "Вторник",
  [Days.Wednesday]: "Среда",
  [Days.Thursday]: "Четверг",
  [Days.Friday]: "Пятница",
  [Days.Saturday]: "Суббота",
  [Days.Sunday]: "Воскресенье",
};

const daysArr = [
  Days.Monday,
  Days.Tuesday,
  Days.Wednesday,
  Days.Thursday,
  Days.Friday,
  Days.Saturday,
  Days.Sunday,
];

interface IWorkTime {
  startTime: string;
  timeWork: number;
}

/** расписание для узла */
interface IStation extends Record<Days, Array<IWorkTime>> {}

/** расписание для узлов */
interface IStations extends Record<string, IStation> {}

/** команды от UI */
enum EcommandSubNames {
  getStations = "getStations",
}
/** команды на UI */
enum EcommandPubNames {
  stationsRes = "stationsRes",
}

interface ICommand<T> {
  name: EcommandPubNames;
  payload: T;
}

@Component({
  selector: "app-watering",
  templateUrl: "./watering.component.html",
  styleUrls: ["./watering.component.less"],
})
export class WateringComponent implements OnInit {
  stations: IStations;
  DaysName = DaysName;
  daysArr = daysArr;
  isEditMap = {};

  constructor(private mqttService: MqttService) {
    this.mqttService.unsafePublish(
      subTopic,
      JSON.stringify({
        name: "getStations",
      }),
      {
        qos: 1,
        retain: true,
      }
    );
  }

  ngOnInit(): void {
    this.mqttService
      .observe(pubTopic)
      .pipe(
        map((message: IMqttMessage) => JSON.parse(message.payload.toString()))
      )
      .subscribe((message: ICommand<any>) => {
        switch (message.name) {
          case EcommandPubNames.stationsRes:
            this.stations = message.payload;
            break;
          default:
            console.warn("неизвестный тип команды", message);
            break;
        }
      });
  }
}
