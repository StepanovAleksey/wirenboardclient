import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { map } from 'rxjs/operators';
import { mockProgram, optionMock, stationsMock } from './mock';
import {
  IOption,
  IProgramChange,
  IPrograms,
  IStationChange,
  IStations,
} from './model';

const subTopic = '/ui-client/sub';
const pubTopic = '/ui-client/pub';
/** команды от UI */
export enum EcommandSubNames {
  getStations = 'getStations',
  getPrograms = 'getPrograms',
  stationChange = 'stationChange',
  programChange = 'programChange',
}
/** команды на UI */
export enum EcommandPubNames {
  stationsRes = 'stationsRes',
  programsRes = 'programsRes',
}

export interface ICommand<T> {
  name: EcommandPubNames;
  payload: T;
}

@Component({
  selector: 'app-watering',
  templateUrl: './watering.component.html',
  styleUrls: ['./watering.component.less'],
})
export class WateringComponent implements OnInit {
  stations: IStations;
  programs: IPrograms = mockProgram;
  options: IOption = optionMock;

  constructor(private mqttService: MqttService) {
    this.sendCommand(EcommandSubNames.getStations);
    this.sendCommand(EcommandSubNames.getPrograms);
  }

  private sendCommand<T>(name: EcommandSubNames, payload?: T) {
    this.mqttService.unsafePublish(
      subTopic,
      JSON.stringify({
        name,
        payload,
      }),
      {
        qos: 1,
        retain: true,
      },
    );
  }

  ngOnInit(): void {
    this.mqttService
      .observe(pubTopic)
      .pipe(
        map((message: IMqttMessage) => JSON.parse(message.payload.toString())),
      )
      .subscribe((message: ICommand<any>) => {
        switch (message.name) {
          case EcommandPubNames.stationsRes:
            this.stations = message.payload;
            break;
          case EcommandPubNames.programsRes:
            this.programs = message.payload;
            break;
          default:
            console.warn('неизвестный тип команды', message);
            break;
        }
      });
  }
  programChange(program: IProgramChange) {
    this.sendCommand(EcommandSubNames.programChange, program);
  }

  stationChange(stationChange: IStationChange) {
    this.sendCommand(EcommandSubNames.stationChange, stationChange);
  }

  optionChange(option: IOption) {
    console.log('optionChange: ', option);
  }
}
