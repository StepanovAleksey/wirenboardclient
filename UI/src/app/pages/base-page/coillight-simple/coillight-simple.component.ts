import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-coillight-simple',
  templateUrl: './coillight-simple.component.html',
  styleUrls: ['./coillight-simple.component.less'],
})
export class CoillightSimpleComponent {
  @Input({ required: true }) onOffStatus: boolean;
  @Input({ required: true }) label: string;

  @Output() changeCoil = new EventEmitter<void>();
}
