import { BehaviorSubject } from 'rxjs';
import { ABaseMqttObj, ETypeWbChanel } from './AWbDevice.model';
import { EMqqtServer } from 'src/app/service/mqqt.service';

const MAX_FREQUENCE = 50;

export enum EFrequencyStatus {
  Forward = 1,
  Stop = 2,
  Backword = 3,
}

/** модель для преобразователя частотты света */
export class FrequencyConverter extends ABaseMqttObj {
  public onOffStatus$ = new BehaviorSubject<boolean>(false);

  public currentFrequency = 25;

  get currentFrequencyPercent() {
    return (this.currentFrequency * 100) / MAX_FREQUENCE;
  }

  constructor(label: string, private adress: number) {
    super(EMqqtServer.wb6, label);
  }

  public setStatus(status: EFrequencyStatus) {
    this.onOffStatus$.next(status !== EFrequencyStatus.Stop);
  }

  public getStartStopTopic() {
    return `/devices/${ETypeWbChanel.FREQUENCY_CONVERTER}_${this.adress}/controls/Start-stop-reverse`;
  }

  public getCurrentFrequencyTopic() {
    return `/devices/${ETypeWbChanel.FREQUENCY_CONVERTER}_${this.adress}/controls/Frequency`;
  }
}
