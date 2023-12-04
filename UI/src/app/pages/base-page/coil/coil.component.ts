import { Component, Input } from '@angular/core';
import { ItemCoil } from 'src/app/models/itemCoil';

@Component({
  selector: 'app-coil',
  templateUrl: './coil.component.html',
  styleUrls: ['./coil.component.less'],
})
export class CoilComponent {
  @Input() coil!: ItemCoil;
}
