import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, filter, skip, take, takeUntil } from 'rxjs/operators';
import { WB_MDM3_Q } from 'src/app/models/wbDevices';
import { MqqtService } from 'src/app/service/mqqt.service';

@Component({
  selector: 'app-dimmer',
  templateUrl: './dimmer.component.html',
  styleUrls: ['./dimmer.component.less'],
})
export class DimmerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dimmer!: WB_MDM3_Q;
  destrot$ = new Subject<void>();
  setBrightness$ = new BehaviorSubject<number>(0);

  constructor(private mqttSrv: MqqtService) {}

  ngOnInit(): void {
    this.subBrightnessTopic$().subscribe((value) => {
      this.dimmer.chanelValue = value;
    });

    this.subBrightnessTopic$()
      .pipe(take(1))
      .subscribe((value) => {
        this.setBrightness$.next(value);
      });

    this.setBrightness$
      .pipe(
        skip(1),
        debounceTime(500),
        filter((value) => value !== this.dimmer.chanelValue),
        takeUntil(this.destrot$),
      )
      .subscribe((value) => {
        this.mqttSrv.publishTopic(
          this.dimmer.wbId,
          this.dimmer.getChangeBrightnessTopic(),
          value,
        );
      });
  }

  private subBrightnessTopic$() {
    return this.mqttSrv
      .subscribeTopic$<number>(
        this.dimmer.wbId,
        this.dimmer.getBrightnessTopic(),
        this,
      )
      .pipe(takeUntil(this.destrot$));
  }

  ngOnDestroy(): void {
    this.destrot$.next();
    this.mqttSrv.unSubscribeClient(this.dimmer.wbId, this);
  }
}
