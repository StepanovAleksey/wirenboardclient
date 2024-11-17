import { EMqqtServer } from 'src/app/service/mqqt.service';
import { EDeviceType, IBaseMqttDevice } from '../device.model';

// /** типы каналов WB устройств */
// export enum ETypeWbChanel {
//   /** WB-MR6C-Q */
//   WB_MR6C_Q = 'WB_MR6C_Q',

//   /** WB-MR6C-I */
//   WB_MR6C_I = 'WB_MR6C_I',

//   /** WB-MDM3-Channel, значение мощности выхода */
//   WB_MDM3_CH = 'WB_MDM3_CH',

//   /** отправка команды на штору */
//   CURTAIN_COMMAND = 'CURTAIN_COMMAND',

//   /** отправка команды на штору */
//   FREQUENCY_CONVERTER = 't13_frequency_converter',
// }

/**
 * базовый класс для всех mqtt устройств
 */
export abstract class ABaseMqttObj {
  constructor(public wbId: EMqqtServer, public label: string) {}
}

/** базовый класс для всех каналов WB устройств */
export abstract class AWbDevice<T extends EDeviceType>
  extends ABaseMqttObj
  implements IBaseMqttDevice<T>
{
  mqttDeviceAddr: string;
  chanelId: number;
  type: T;

  constructor(item: IBaseMqttDevice<T>) {
    super(EMqqtServer.wb7, item.label);
    this.mqttDeviceAddr = item.mqttDeviceAddr;
    this.chanelId = item.chanelId;
  }

  protected abstract tempalte: string;

  public getBaseTopic(mqttDeviceAddr: string, coilId: number) {
    return this.tempalte
      .replace('{mqttDeviceAddr}', mqttDeviceAddr.toString())
      .replace('{cNumber}', coilId.toString());
  }

  /** топик на управление */
  public getChangeTopic(mqttDeviceAddr: string, coilId: number) {
    return `${this.getBaseTopic(mqttDeviceAddr, coilId)}/on`;
  }
}
