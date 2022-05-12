import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { timer } from 'rxjs';
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
  getOptions = 'getOptions',
  stationChange = 'stationChange',
  programChange = 'programChange',
  optionChange = 'optionChange',
}
/** команды на UI */
export enum EcommandPubNames {
  stationsRes = 'stationsRes',
  programsRes = 'programsRes',
  optionsRes = 'optionsRes',
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
    timer(500).subscribe(() => {
      this.sendCommand(EcommandSubNames.getPrograms);
    });
    timer(1000).subscribe(() => {
      this.sendCommand(EcommandSubNames.getOptions);
    });
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
          case EcommandPubNames.optionsRes:
            this.options = message.payload;
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
    this.sendCommand(EcommandSubNames.optionChange, option);
  }
}
