import { Component, OnInit } from "@angular/core";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { map } from "rxjs/operators";
import { IProgram, IStations, mockProgram } from "./model";

const subTopic = "/ui-client/sub";
const pubTopic = "/ui-client/pub";
/** команды от UI */
export enum EcommandSubNames {
  getStations = "getStations",
}
/** команды на UI */
export enum EcommandPubNames {
  stationsRes = "stationsRes",
}

export interface ICommand<T> {
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
  programs: IProgram[] = mockProgram;

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
