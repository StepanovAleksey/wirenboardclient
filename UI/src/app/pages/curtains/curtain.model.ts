import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ABaseMqttObj } from 'src/app/models/wbDevices';
import { EMqqtServer, MqqtService } from 'src/app/service/mqqt.service';

export class Group {
  isSelected = false;
  constructor(public name: string, public curtains: Array<Curtain>) {}
}
const TOPIC_TEMPLATE = '/devices/curtain_drive/{groupId}/{chanleId}';
/** список комманд  */
export enum ECurtainCommandType {
  up = 'up',
  stop = 'stop',
  down = 'down',
  dntMovUp = 'dntMovUp',
  dntMovDown = 'dntMovDown',
  learn = 'learn',
  delete = 'delete',
  setPercent = 'setPercent',
  /** текущее положение мотора */
  statusDriver = 'statusDriver',
  /** скорость обмена по RS и тд. */
  optionDriver = 'optionDriver',
}
export class Curtain extends ABaseMqttObj {
  isSelected = false;
  position = 0;

  constructor(
    public chanleId: number,
    private mqqtService: MqqtService,
    private destroy$: Subject<void>,
    private command$: Subject<ECurtainCommandType>,
    private possitionCommand$: Subject<number>,
    public groupId = 1,
  ) {
    super(EMqqtServer.wb7, 'Штора');

    this.subTopic$<number>(`${this.getBaseTopic()}/position`).subscribe(
      (payload) => {
        this.position = payload;
      },
    );

    this.command$
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.isSelected),
      )
      .subscribe((cmd) => this.sendCommand(cmd));

    this.possitionCommand$
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.isSelected),
      )
      .subscribe((position) => this.sendPosition(position));
  }

  private sendPosition(position: number) {
    this.pubTopic(`${this.getBaseTopic()}/position/on`, position);
  }

  private sendCommand(command: ECurtainCommandType) {
    this.pubTopic(`${this.getBaseTopic()}/command/on`, command);
  }

  private getBaseTopic() {
    return TOPIC_TEMPLATE.replace('{groupId}', this.groupId.toString()).replace(
      '{chanleId}',
      this.chanleId.toString(),
    );
  }
  private subTopic$<T>(topic: string) {
    return this.mqqtService
      .subscribeTopic$<T>(EMqqtServer.wb7, topic, this)
      .pipe(takeUntil(this.destroy$));
  }

  private pubTopic<T>(topic: string, payload: T) {
    this.mqqtService.publishTopic(this.wbId, topic, payload);
  }
}
