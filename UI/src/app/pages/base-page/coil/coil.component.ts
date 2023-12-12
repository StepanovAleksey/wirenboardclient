import { Component, Input } from '@angular/core';
import { WB_MR6C_Q } from 'src/app/models/wbDevice.model';

@Component({
  selector: 'app-coil',
  templateUrl: './coil.component.html',
  styleUrls: ['./coil.component.less'],
})
export class CoilComponent {
  @Input() coil!: WB_MR6C_Q;
}
