import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Curtain, ECommandType, Group } from './curtain.model';
import { MqqtService } from 'src/app/service/mqqt.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-curtains',
  templateUrl: './curtains.component.html',
  styleUrls: ['./curtains.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class CurtainsComponent implements OnDestroy {
  private _percent = 0;

  get setPercent() {
    return this._percent;
  }
  set setPercent(value: number) {
    this._percent = value;
    this.possitionCommand$.next(this._percent);
  }

  get isAnySelected() {
    return this.groups.some((g) => g.curtains.some((c) => c.isSelected));
  }

  destroy$ = new Subject<void>();

  command$ = new Subject<ECommandType>();
  possitionCommand$ = new Subject<number>();

  ECommandType = ECommandType;

  groups: Array<Group> = [
    new Group('Гостинная', [
      this.getNewDevice(1),
      this.getNewDevice(2),
      this.getNewDevice(3),
      this.getNewDevice(4),
      this.getNewDevice(5),
    ]),
    new Group('Кухня', [this.getNewDevice(6), this.getNewDevice(7)]),
    new Group('Чайная', [this.getNewDevice(8), this.getNewDevice(9)]),
    new Group('Кабинет', [this.getNewDevice(10), this.getNewDevice(11)]),
    new Group('Бассейн', [this.getNewDevice(12), this.getNewDevice(13)]),
    new Group('Спальня', [this.getNewDevice(14), this.getNewDevice(15)]),
  ];

  constructor(private mqqtServer: MqqtService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  sendCommand(command: ECommandType) {
    this.command$.next(command);
  }

  private getNewDevice(deviceNumber: number) {
    return new Curtain(
      deviceNumber,
      this.mqqtServer,
      this.destroy$,
      this.command$,
      this.possitionCommand$,
    );
  }
}
