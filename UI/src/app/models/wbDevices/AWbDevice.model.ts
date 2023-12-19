import { EMqqtServer } from 'src/app/service/mqqt.service';

/** типы каналов WB устройств */
export enum ETypeWbChanel {
  /** WB-MR6C-Q */
  WB_MR6C_Q = 'WB_MR6C_Q',

  /** WB-MR6C-I */
  WB_MR6C_I = 'WB_MR6C_I',

  /** WB-MDM3-Channel, значение мощности выхода */
  WB_MDM3_CH = 'WB_MDM3_CH',

  /** отправка команды на штору */
  CURTAIN_COMMAND = 'CURTAIN_COMMAND',
}
/**
 * базовый класс для всех mqtt устройств
 */
export abstract class ABaseMqttObj {
  constructor(public wbId: EMqqtServer, public label: string) {}
}

/** шаблоны топиков */
export const TOPIC_TEMPLATE: Record<ETypeWbChanel, string> = {
  [ETypeWbChanel.WB_MR6C_Q]: '/devices/{mqttDeviceAddr}/controls/K{cNumber}',
  [ETypeWbChanel.WB_MR6C_I]:
    '/devices/{mqttDeviceAddr}/controls/Input {cNumber}',
  [ETypeWbChanel.WB_MDM3_CH]:
    '/devices/{mqttDeviceAddr}/controls/Channel {cNumber}',
  [ETypeWbChanel.CURTAIN_COMMAND]:
    '/devices/curtain_drive/{groupId}/{chanleId}/command/on',
};

/** базовый класс для всех каналов WB устройств */
export abstract class AWbDevice extends ABaseMqttObj {
  constructor(public label: string, public typeWbChanel: ETypeWbChanel) {
    super(EMqqtServer.wb7, label);
  }

  public getBaseTopic(
    typeDevice: ETypeWbChanel,
    mqttDeviceAddr: string,
    coilId: number,
  ) {
    if (!TOPIC_TEMPLATE[typeDevice]) {
      throw 'Неизвестный тип устройства';
    }
    return TOPIC_TEMPLATE[typeDevice]
      .replace('{mqttDeviceAddr}', mqttDeviceAddr.toString())
      .replace('{cNumber}', coilId.toString());
  }

  /** топик на управление */
  public getChangeTopic(
    typeDevice: ETypeWbChanel,
    mqttDeviceAddr: string,
    coilId: number,
  ) {
    return `${this.getBaseTopic(typeDevice, mqttDeviceAddr, coilId)}/on`;
  }
}
