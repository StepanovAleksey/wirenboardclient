import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IStation } from '../model';
const defaultTime = 20;
@Component({
  selector: 'app-manual-run',
  templateUrl: './manual-run.component.html',
  styleUrls: ['./manual-run.component.less'],
})
export class ManualRunComponent implements OnInit, OnChanges {
  @Input() stations: IStation;

  @Output() sendCommand = new EventEmitter();

  times: Record<string, number> = {};

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.stations?.currentValue) {
      this.times = Object.keys(changes.stations.currentValue).reduce((a, b) => {
        a[b] = defaultTime;
        return a;
      }, {});
    }
  }

  ngOnInit(): void {}
}
