import { BehaviorSubject } from 'rxjs';
import { AWbDevice } from './AWbDevice.model';
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
  tempalte = '/devices/{mqttDeviceAddr}/controls/K{cNumber}';
  public onOffStatus$ = new BehaviorSubject<boolean>(false);
  chanelId: number;

  constructor(item: IWB_MR6C_Q) {
    super(item);
    this.chanelId = item.chanelId;
  }

  public getCoilTopic() {
    return super.getBaseTopic(this.mqttDeviceAddr, this.chanelId);
  }
  public getChangeCoilTopic() {
    return super.getChangeTopic(this.mqttDeviceAddr, this.chanelId);
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
