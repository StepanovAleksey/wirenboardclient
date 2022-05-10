import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import {
  daysArr,
  DaysName,
  IPrograms,
  IStation,
  IStationChange,
} from '../model';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.less'],
})
export class ZonesComponent implements OnInit {
  @Input() stations: Array<IStation>;

  programsKey: Array<SelectItem<string>>;
  @Input() set programs(value: IPrograms) {
    this.programsKey = [
      {
        value: null,
        label: '',
      },
      ...Object.keys(value).map((v) => ({
        value: v,
        label: v,
      })),
    ];
  }

  @Output() stationChange = new EventEmitter<IStationChange>();

  DaysName = DaysName;
  daysArr = daysArr;

  constructor() {}

  ngOnInit(): void {}
}
