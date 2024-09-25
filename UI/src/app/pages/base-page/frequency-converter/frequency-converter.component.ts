import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EFrequencyStatus, FrequencyConverter } from 'src/app/models/wbDevices';
import { MqqtService } from 'src/app/service/mqqt.service';

@Component({
  selector: 'app-frequency-converter',
  templateUrl: './frequency-converter.component.html',
  styleUrls: ['./frequency-converter.component.less'],
})
export class FrequencyConverterComponent implements OnInit, OnDestroy {
  @Input({ required: true }) frequencyConverter!: FrequencyConverter;

  destroy$ = new Subject<void>();

  setFrequency$ = new BehaviorSubject<number>(0);

  constructor(private mqttSrv: MqqtService) {}

  ngOnInit(): void {
    this.currentFrequency$().subscribe((frequency) => {
      this.frequencyConverter.currentFrequency = frequency;
      this.setFrequency$.next(frequency);
    });

    this.startStop$().subscribe((status) => {
      this.frequencyConverter.setStatus(status);
    });
  }

  runStop() {
    this.mqttSrv.publishTopic(
      this.frequencyConverter.wbId,
      `${this.frequencyConverter.getStartStopTopic()}/on`,
      this.frequencyConverter.onOffStatus$.value
        ? EFrequencyStatus.Stop
        : EFrequencyStatus.Forward,
    );
  }
  changeFreq(freq: number) {
    this.mqttSrv.publishTopic(
      this.frequencyConverter.wbId,
      `${this.frequencyConverter.getCurrentFrequencyTopic()}/on`,
      freq,
    );
  }

  private currentFrequency$() {
    return this.mqttSrv
      .subscribeTopic$<number>(
        this.frequencyConverter.wbId,
        this.frequencyConverter.getCurrentFrequencyTopic(),
        this,
      )
      .pipe(takeUntil(this.destroy$));
  }

  private startStop$() {
    return this.mqttSrv
      .subscribeTopic$<EFrequencyStatus>(
        this.frequencyConverter.wbId,
        this.frequencyConverter.getStartStopTopic(),
        this,
      )
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.mqttSrv.unSubscribeClient(this.frequencyConverter.wbId, this);
  }
}
