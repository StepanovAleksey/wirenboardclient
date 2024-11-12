import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Curtain, ECurtainCommandType, Group } from './curtain.model';
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

  command$ = new Subject<ECurtainCommandType>();
  possitionCommand$ = new Subject<number>();

  ECommandType = ECurtainCommandType;

  groups: Array<Group> = [];

  constructor(private mqqtServer: MqqtService) {
    console.log(mqqtServer);

    this.groups = [
      new Group('Гостинная', [
        this.getNewDevice(1),
        this.getNewDevice(2),
        this.getNewDevice(3),
        this.getNewDevice(4),
        this.getNewDevice(5),
      ]),
      new Group('Кухня', [this.getNewDevice(6), this.getNewDevice(7)]),
      new Group('Бассейн', [
        this.getNewDevice(8),
        this.getNewDevice(9),
        this.getNewDevice(10),
      ]),
      new Group('Спальня', [this.getNewDevice(11), this.getNewDevice(12)]),
      new Group('Чайная', [this.getNewDevice(13), this.getNewDevice(14)]),
      new Group('Кабинет', [this.getNewDevice(15), this.getNewDevice(16)]),
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  sendCommand(command: ECurtainCommandType) {
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
