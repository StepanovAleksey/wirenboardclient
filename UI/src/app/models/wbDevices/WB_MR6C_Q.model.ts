import { BehaviorSubject } from 'rxjs';
import { AWbDevice, ETypeWbChanel } from './AWbDevice.model';

/*** класс для реле 6-и канального реле */
export class WB_MR6C_Q extends AWbDevice {
  public onOffStatus$ = new BehaviorSubject<boolean>(false);

  constructor(
    public label: string,
    protected mqttDeviceAddr: string,
    protected chanelId: number,
    typeWbChanel = ETypeWbChanel.WB_MR6C_Q,
  ) {
    super(label, typeWbChanel);
  }

  public getCoilTopic() {
    return super.getBaseTopic(
      ETypeWbChanel.WB_MR6C_Q,
      this.mqttDeviceAddr,
      this.chanelId,
    );
  }
  public getChangeCoilTopic() {
    return super.getChangeTopic(
      ETypeWbChanel.WB_MR6C_Q,
      this.mqttDeviceAddr,
      this.chanelId,
    );
  }
}
