import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IStation, IZoneTopicSettings } from '../model';
const defaultTime = 20;
export enum ECommand {
  Start = 'Start',
  Stop = 'Stop',
}
export interface IManualAction {
  commnad: ECommand;
  timeSec: number;
  zoneKey: string;
}
@Component({
  selector: 'app-manual-run',
  templateUrl: './manual-run.component.html',
  styleUrls: ['./manual-run.component.less'],
})
export class ManualRunComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stations: IStation;
  @Input() zoneRelayTopicsMaps: IZoneTopicSettings;
  @Output() sendCommand = new EventEmitter<IManualAction>();

  times: Record<string, number> = {};

  relayStatus: Record<string, number> = {};
  destroy$ = new Subject();

  constructor(private mqttService: MqttService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.stations?.currentValue) {
      this.times = Object.keys(changes.stations.currentValue).reduce((a, b) => {
        a[b] = defaultTime;
        return a;
      }, {});
    }
    if (!!changes.zoneRelayTopicsMaps?.currentValue) {
      this.initRelayTopics(changes.zoneRelayTopicsMaps.currentValue);
    }
  }

  private initRelayTopics(topicSetting: IZoneTopicSettings) {
    Object.keys(topicSetting).forEach((zoneKey) => {
      this.mqttService
        .observe(
          `/devices/${topicSetting[zoneKey].deviceName}/controls/${topicSetting[zoneKey].control}`,
        )
        .pipe(
          takeUntil(this.destroy$),
          map((message: IMqttMessage) =>
            JSON.parse(message.payload.toString()),
          ),
        )
        .subscribe((event: number) => {
          this.relayStatus[zoneKey] = event;
        });
    });
  }

  ngOnInit(): void {}

  start(zoneKey: string) {
    this.sendCommand.emit({
      commnad: ECommand.Start,
      timeSec: this.times[zoneKey],
      zoneKey,
    });
  }
  stop(zoneKey: string) {
    this.sendCommand.emit({
      commnad: ECommand.Stop,
      timeSec: this.times[zoneKey],
      zoneKey,
    });
  }
}
