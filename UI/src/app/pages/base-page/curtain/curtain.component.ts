import { Component, Input } from '@angular/core';
import { ECurtainCommandType } from '../../curtains/curtain.model';
import { MqqtService } from 'src/app/service/mqqt.service';
import { CurtainGroup } from 'src/app/models/wbDevices';

@Component({
  selector: 'app-curtain',
  templateUrl: './curtain.component.html',
  styleUrls: ['./curtain.component.less'],
})
export class CurtainComponent {
  @Input({ required: true }) curtainGroup: CurtainGroup;
  ECurtainCommandType = ECurtainCommandType;
  constructor(private mqttSrv: MqqtService) {}

  sendCommand(command: ECurtainCommandType) {
    this.curtainGroup.curtains.forEach((curtain) => {
      this.mqttSrv.publishTopic(
        this.curtainGroup.wbId,
        curtain.getCommandTopic(),
        command,
      );
    });
  }
}
