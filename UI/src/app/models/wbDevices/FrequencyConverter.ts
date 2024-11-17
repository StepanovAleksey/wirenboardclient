import { BehaviorSubject } from 'rxjs';
import { AWbDevice } from './AWbDevice.model';
import {
  EDeviceType,
  IAllItem,
  IFrequencyConverter,
  isCheckType,
} from '../device.model';

const MAX_FREQUENCE = 50;

export enum EFrequencyStatus {
  Forward = 1,
  Stop = 2,
  Backword = 3,
}

/** модель для преобразователя частотты света */
export class FrequencyConverter
  extends AWbDevice<EDeviceType.FrequencyConverter>
  implements IFrequencyConverter
{
  protected tempalte: string;

  public onOffStatus$ = new BehaviorSubject<boolean>(false);

  public currentFrequency = 25;

  get currentFrequencyPercent() {
    return (this.currentFrequency * 100) / MAX_FREQUENCE;
  }

  constructor(item: IFrequencyConverter) {
    super(item);
  }

  public setStatus(status: EFrequencyStatus) {
    this.onOffStatus$.next(status !== EFrequencyStatus.Stop);
  }

  public getStartStopTopic() {
    return `/devices/${this.mqttDeviceAddr}/controls/Start-stop-reverse`;
  }

  public getCurrentFrequencyTopic() {
    return `/devices/${this.mqttDeviceAddr}/controls/Frequency`;
  }

  static canCreate(item: IAllItem) {
    return isCheckType<IFrequencyConverter, EDeviceType.FrequencyConverter>(
      item,
      EDeviceType.FrequencyConverter,
    );
  }
  static create(item: IAllItem) {
    return new FrequencyConverter(item as IFrequencyConverter);
  }
}
