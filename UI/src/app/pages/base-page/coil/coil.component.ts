import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WB_MR6C_Q } from 'src/app/models/wbDevices';
import { MqqtService } from 'src/app/service/mqqt.service';

@Component({
  selector: 'app-coil',
  templateUrl: './coil.component.html',
  styleUrls: ['./coil.component.less'],
})
export class CoilComponent implements OnInit, OnDestroy {
  @Input({ required: true }) coil!: WB_MR6C_Q;
  destrot$ = new Subject<void>();

  constructor(private mqttSrv: MqqtService) {}

  ngOnInit(): void {
    this.mqttSrv
      .subscribeTopic$<boolean>(this.coil.wbId, this.coil.getCoilTopic(), this)
      .pipe(takeUntil(this.destrot$))
      .subscribe((onOffStatus) => {
        this.coil.onOffStatus$.next(onOffStatus);
      });
  }

  ngOnDestroy(): void {
    this.destrot$.next();
    this.mqttSrv.unSubscribeClient(this.coil.wbId, this);
  }

  changeCoil() {
    this.mqttSrv.publishTopic(
      this.coil.wbId,
      this.coil.getChangeCoilTopic(),
      !!this.coil.onOffStatus$.value ? 0 : 1,
    );
  }
}
