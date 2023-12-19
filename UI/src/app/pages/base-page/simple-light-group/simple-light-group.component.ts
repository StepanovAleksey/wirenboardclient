import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SimpleLightGroup } from 'src/app/models/wbDevices';
import { MqqtService } from 'src/app/service/mqqt.service';

@Component({
  selector: 'app-simple-light-group',
  templateUrl: './simple-light-group.component.html',
  styleUrls: ['./simple-light-group.component.less'],
})
export class SimpleLightGroupComponent {
  @Input({ required: true }) lightGroup!: SimpleLightGroup;

  destrot$ = new Subject<void>();

  constructor(private mqttSrv: MqqtService) {}

  ngOnInit(): void {
    this.lightGroup.getAllColis().forEach((coil) => {
      this.mqttSrv
        .subscribeTopic$<boolean>(coil.wbId, coil.getCoilTopic(), this)
        .pipe(takeUntil(this.destrot$))
        .subscribe((onOffStatus) => {
          coil.onOffStatus$.next(onOffStatus);
        });
    });
  }

  changeCoil() {
    this.lightGroup.mainCoils.forEach((coil) => {
      this.mqttSrv.publishTopic(coil.wbId, coil.getChangeCoilTopic(), 0);
    });

    this.lightGroup.simpleCoils.forEach((coil) => {
      this.mqttSrv.publishTopic(
        coil.wbId,
        coil.getChangeCoilTopic(),
        this.lightGroup.onOffStatus$.value ? 0 : 1,
      );
    });
  }

  ngOnDestroy(): void {
    this.destrot$.next();
    this.lightGroup.getAllColis().forEach((coil) => {
      this.mqttSrv.unSubscribeClient(coil.wbId, this);
    });
  }
}
