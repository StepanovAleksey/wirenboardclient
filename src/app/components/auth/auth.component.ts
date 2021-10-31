import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.less"],
})
export class AuthComponent implements OnInit {
  password = "";
  isError = false;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.isError = config.data.hasError;
  }

  ngOnInit() {}
  ok() {
    this.ref.close(this.password);
  }
}
