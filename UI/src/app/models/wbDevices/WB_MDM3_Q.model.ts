import {
  EDeviceType,
  IAllItem,
  isCheckType,
  IWB_MDM3_Q,
} from '../device.model';
import { AWbDevice, ETypeWbChanel } from './AWbDevice.model';

/** класс для управления катушкой и мощностью канала диммера */
export class WB_MDM3_Q
  extends AWbDevice<EDeviceType.WB_MDM3_Q>
  implements IWB_MDM3_Q
{
  public chanelValue: number = 0;
  type: EDeviceType.WB_MDM3_Q;

  constructor(item: IWB_MDM3_Q) {
    super(item, ETypeWbChanel.WB_MDM3_CH);
  }

  public getBrightnessTopic() {
    return this.getBaseTopic(
      ETypeWbChanel.WB_MDM3_CH,
      this.mqttDeviceAddr,
      this.chanelId,
    );
  }

  public getChangeBrightnessTopic() {
    return this.getChangeTopic(
      ETypeWbChanel.WB_MDM3_CH,
      this.mqttDeviceAddr,
      this.chanelId,
    );
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
