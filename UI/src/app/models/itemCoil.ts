import {
  ABaseMqttObj,
  EMqqtServer,
  MqqtService,
} from '../service/mqqt.service';
import { Subject } from 'rxjs';
import { ETags } from './tags';

/** тип катушки (вход/выход) */
export enum ETypeCoil {
  output = 'output',
  input = 'input',
}

const TOPIC_TEMPLATE: Record<ETypeCoil, string> = {
  [ETypeCoil.output]: '/devices/{mqttDeviceAddr}/controls/K{cNumber}',
  [ETypeCoil.input]: '/devices/{mqttDeviceAddr}/controls/Input {cNumber}',
};

export class ItemCoil extends ABaseMqttObj {
  public onOffStatus: boolean;

  constructor(
    public label: string,
    private typeCoil: ETypeCoil,
    private mqttDeviceAddr: string,
    private coilId: number,
    private tags: Array<ETags>,
    mqqtService: MqqtService,
    protected destroy$ = new Subject<void>(),
  ) {
    super(mqqtService, destroy$, EMqqtServer.wb7);
  }

  public subscribeTopic() {
    this.subTopic$(`${this.getBaseTopic()}`).subscribe((data) => {
      this.onOffStatus = !!data;
    });
  }

  public unsub() {
    this.destroy$.next();
  }

  public isExistTagsRoute(tags: Array<ETags>) {
    return this.tags.some((t) => tags.includes(t));
  }

  public toggleCoil() {
    this.pubTopic(`${this.getBaseTopic()}/on`, this.onOffStatus ? 0 : 1);
  }

  private getBaseTopic() {
    return TOPIC_TEMPLATE[this.typeCoil]
      .replace('{mqttDeviceAddr}', this.mqttDeviceAddr.toString())
      .replace('{cNumber}', this.coilId.toString());
  }
}
