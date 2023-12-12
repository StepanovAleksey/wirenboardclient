import { Component, Input } from '@angular/core';
import { WB_MDM3_Q } from 'src/app/models/wbDevice.model';

@Component({
  selector: 'app-dimmer',
  templateUrl: './dimmer.component.html',
  styleUrls: ['./dimmer.component.less'],
})
export class DimmerComponent {
  @Input() dimmChanel!: WB_MDM3_Q;
}
