import {
  EDeviceType,
  IAllItem,
  isCheckType,
  IWB_MDM3_Q,
} from '../device.model';
import { AWbDevice } from './AWbDevice.model';

/** класс для управления катушкой и мощностью канала диммера */
export class WB_MDM3_Q
  extends AWbDevice<EDeviceType.WB_MDM3_Q>
  implements IWB_MDM3_Q
{
  protected tempalte = '/devices/{mqttDeviceAddr}/controls/Channel {cNumber}';
  public chanelValue: number = 0;
  chanelId: number;

  constructor(item: IWB_MDM3_Q) {
    super(item);
    this.chanelId = item.chanelId;
  }

  public getCoilTopic() {
    return super.getBaseTopic(this.mqttDeviceAddr, this.chanelId);
  }
  public getChangeCoilTopic() {
    return super.getChangeTopic(this.mqttDeviceAddr, this.chanelId);
  }

  public getBrightnessTopic() {
    return this.getBaseTopic(this.mqttDeviceAddr, this.chanelId);
  }

  public getChangeBrightnessTopic() {
    return this.getChangeTopic(this.mqttDeviceAddr, this.chanelId);
  }

  static canCreate(item: IAllItem) {
    return isCheckType<IWB_MDM3_Q, EDeviceType.WB_MDM3_Q>(
      item,
      EDeviceType.WB_MDM3_Q,
    );
  }
  static create(item: IAllItem) {
    return new WB_MDM3_Q(item as IWB_MDM3_Q);
  }
}
