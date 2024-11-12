import { BehaviorSubject } from 'rxjs';
import { AWbDevice, ETypeWbChanel } from './AWbDevice.model';
import {
  EDeviceType,
  IAllItem,
  isCheckType,
  IWB_MR6C_Q,
} from '../device.model';

/*** класс для реле 6-и канального реле */
export class WB_MR6C_Q
  extends AWbDevice<EDeviceType.WB_MR6C_Q>
  implements IWB_MR6C_Q
{
  public onOffStatus$ = new BehaviorSubject<boolean>(false);
  type: EDeviceType.WB_MR6C_Q;

  constructor(item: IWB_MR6C_Q) {
    super(item, ETypeWbChanel.WB_MR6C_Q);
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

  static canCreate(item: IAllItem) {
    return isCheckType<IWB_MR6C_Q, EDeviceType.WB_MR6C_Q>(
      item,
      EDeviceType.WB_MR6C_Q,
    );
  }
  static create(item: IAllItem) {
    return new WB_MR6C_Q(item as IWB_MR6C_Q);
  }
}
