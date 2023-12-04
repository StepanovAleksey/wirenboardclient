import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Group } from '../curtain.model';

@Component({
  selector: 'app-curtains-group',
  templateUrl: './curtains-group.component.html',
  styleUrls: ['./curtains-group.component.less']
})
export class CurtainsGroupComponent {
  @Input({ required: true }) group: Group;

  selectGroup() {
    this.group.isSelected = !this.group.isSelected;
    this.group.curtains.forEach(c => c.isSelected = this.group.isSelected);
  }
}
