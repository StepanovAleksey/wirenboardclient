import { Component, OnInit } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { AuthComponent } from "src/app/components/auth/auth.component";

const localSrgKey = "Auth";

@Component({
  templateUrl: "./auth-service.component.html",
  providers: [DialogService],
})
export class AuthServiceComponent implements OnInit {
  private _passwordValid = "1234987";

  public get IsAuth(): boolean {
    const auth = JSON.parse(localStorage.getItem(localSrgKey));
    if (auth) {
      return auth;
    }
    this.show();
    return false;
  }

  constructor(public dialogService: DialogService) {}

  ngOnInit() {}
  private show(isError?: boolean) {
    const ref = this.dialogService.open(AuthComponent, {
      data: {
        hasError: isError,
      },
      header: "Авторизируйтесь",
      style: { "max-height": "350px", "max-width": "350px" },
    });

    ref.onClose.subscribe((pass: string) => {
      if (typeof pass === "undefined") {
        return;
      }
      if (pass === this._passwordValid) {
        this.setAuth();
      } else {
        this.show(true);
      }
    });
  }
  setAuth() {
    localStorage.setItem(localSrgKey, JSON.stringify(true));
  }
}
