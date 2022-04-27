import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MenuItemEnum } from "./models/menuItems";
import { WateringComponent } from "./pages/watering/watering.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/watering",
    pathMatch: "full",
  },
  {
    path: "watering",
    component: WateringComponent,
    data: {
      filter: MenuItemEnum.watering,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
