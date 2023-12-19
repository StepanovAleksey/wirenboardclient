import { BehaviorSubject } from 'rxjs';
import { ABaseMqttObj, ETypeWbChanel, TOPIC_TEMPLATE } from './AWbDevice.model';
import { EMqqtServer } from 'src/app/service/mqqt.service';

/** класс для драйверов штор */
export class Curtain {
  public position$ = new BehaviorSubject<number>(0);

  constructor(private groupId: number, private chanelId: number) {}

  getCommandTopic() {
    return TOPIC_TEMPLATE[ETypeWbChanel.CURTAIN_COMMAND]
      .replace('{groupId}', this.groupId.toString())
      .replace('{chanleId}', this.chanelId.toString());
  }
}

/** класс для управления группой драверов штор */
export class CurtainGroup extends ABaseMqttObj {
  constructor(label, public curtains: Array<Curtain>) {
    super(EMqqtServer.wb7, label);
  }
}
