import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { IProgramChange, IProgramOption, IPrograms } from '../model';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less'],
})
export class ProgramsComponent implements OnInit {
  @Input() programs: IPrograms;

  @Output() programChange = new EventEmitter<IProgramChange>();

  constructor() {}

  ngOnInit(): void {}

  changeTime(date: Date, programKey: string, item: IProgramOption) {
    item.startTime = !date
      ? null
      : [date.getHours(), date.getMinutes()].join(':');
    this.cahngeValue(programKey);
  }

  cahngeValue(programKey: string) {
    this.programChange.emit({
      key: programKey,
      value: this.programs[programKey],
    });
  }
}
