import { ETypeWbChanel } from './AWbDevice.model';
import { WB_MR6C_Q } from './WB_MR6C_Q.model';

/** класс для управления катушкой и мощностью канала диммера */
export class WB_MDM3_Q extends WB_MR6C_Q {
  public chanelValue: number;
  constructor(
    public label: string,
    protected mqttDeviceAddr: string,
    protected chanelId: number,
  ) {
    super(label, mqttDeviceAddr, chanelId, ETypeWbChanel.WB_MDM3_CH);
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
}
