import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IManualAction } from './manual-run/manual-run.component';
import { mockProgram, optionMock, stationsMock } from './mock';
import {
  IControlSetting,
  IOption,
  IProgramChange,
  IPrograms,
  IStationChange,
  IStations,
  IZoneTopicSettings,
} from './model';

const subTopic = '/ui-client/sub';
const pubTopic = '/ui-client/pub';
/** команды от UI */
export enum EcommandSubNames {
  init = 'init',
  stationChange = 'stationChange',
  programChange = 'programChange',
  optionChange = 'optionChange',
  manualSendCommand = 'manualSendCommand',
}
/** команды на UI */
export enum EcommandPubNames {
  stationsRes = 'stationsRes',
  programsRes = 'programsRes',
  optionsRes = 'optionsRes',
  initRes = 'initRes',
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
  stations: IStations = stationsMock;
  programs: IPrograms = mockProgram;
  options: IOption = optionMock;
  zoneRelayTopicsMaps: IZoneTopicSettings = {};
  destroy$ = new Subject();

  temperature$ = new Observable<number>();
  rainDetected$ = new Observable<string>();

  constructor(private mqttService: MqttService) {
    this.sendCommand(EcommandSubNames.init);
  }

  manualSendCommand(command: IManualAction) {
    this.sendCommand(EcommandSubNames.manualSendCommand, command);
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
          case EcommandPubNames.initRes:
            const {
              stations,
              programs,
              options,
              zoneRelayTopicsMaps,
              detectsDevices,
            } = message.payload;
            this.stations = stations;
            this.programs = programs;
            this.options = options;
            this.zoneRelayTopicsMaps = zoneRelayTopicsMaps;
            this.temperature$ = this.subControl(detectsDevices.temperature);
            this.rainDetected$ = this.subControl(detectsDevices.rain).pipe(
              map((isRain) => (isRain ? 'нет дождя' : 'дождь')),
            );
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

  private subControl<T>(controlSetting: IControlSetting) {
    return this.mqttService
      .observe(
        `/devices/${controlSetting.deviceName}/controls/${controlSetting.control}`,
      )
      .pipe(
        takeUntil(this.destroy$),
        map(
          (message: IMqttMessage) =>
            JSON.parse(message.payload.toString()) as T,
        ),
      );
  }
}
