import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

import { IProgram, IProgramOption } from "../model";

@Component({
  selector: "app-programs",
  templateUrl: "./programs.component.html",
  styleUrls: ["./programs.component.less"],
})
export class ProgramsComponent implements OnInit {
  @Input() programs: Array<IProgram>;

  @Output() programChange = new EventEmitter<IProgram>();

  constructor() {}

  ngOnInit(): void {}

  changeTime(date: Date, program: IProgram, item: IProgramOption) {
    item.startTime = [date.getHours(), date.getMinutes()].join(":");
    this.programChange.emit(program);
  }
}
