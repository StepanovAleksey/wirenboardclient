import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LightGroup } from 'src/app/models/wbDevices/LightGroup.model';
import { MqqtService } from 'src/app/service/mqqt.service';

@Component({
  selector: 'app-light-group',
  templateUrl: './light-group.component.html',
  styleUrls: ['./light-group.component.less'],
})
export class LightGroupComponent implements OnInit, OnDestroy {
  @Input({ required: true }) lightGroup!: LightGroup;

  destrot$ = new Subject<void>();

  constructor(private mqttSrv: MqqtService) {}

  ngOnInit(): void {
    this.lightGroup.coils.forEach((coil) => {
      this.mqttSrv
        .subscribeTopic$<boolean>(coil.wbId, coil.getCoilTopic(), this)
        .pipe(takeUntil(this.destrot$))
        .subscribe((onOffStatus) => {
          coil.onOffStatus$.next(onOffStatus);
        });
    });
  }

  changeCoil() {
    this.lightGroup.coils.forEach((coil) => {
      this.mqttSrv.publishTopic(
        coil.wbId,
        coil.getChangeCoilTopic(),
        !!this.lightGroup.onOffStatus$.value ? 0 : 1,
      );
    });
  }

  ngOnDestroy(): void {
    this.destrot$.next();
    this.lightGroup.coils.forEach((coil) => {
      this.mqttSrv.unSubscribeClient(coil.wbId, this);
    });
  }
}
