import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SelectItem } from "primeng/api";
import { daysArr, DaysName, IProgram, IStation } from "../model";

@Component({
  selector: "app-zones",
  templateUrl: "./zones.component.html",
  styleUrls: ["./zones.component.less"],
})
export class ZonesComponent implements OnInit {
  @Input() stations: Array<IStation>;

  programsKey: Array<SelectItem<string>>;
  @Input() set programs(value: Array<IProgram>) {
    this.programsKey = value.map((v) => ({
      value: v.name,
      label: v.name,
    }));
    this.programsKey.unshift({
      value: null,
      label: "",
    });
  }

  @Output() stationChange = new EventEmitter<IStation>();

  DaysName = DaysName;
  daysArr = daysArr;

  constructor() {}

  ngOnInit(): void {}
}
