import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasePageComponent } from './pages/base-page/base-page.component';
import { MenuItemEnum } from './models/menuItems';
import { RulesComponent } from './pages/rules/rules.component';


const routes: Routes = [
  {
    path: '', redirectTo: '/Active', pathMatch: 'full'
  },
  {
    path: 'FirstLevel', component: BasePageComponent, data: {
      filter: MenuItemEnum.FirstLevel
    }
  },
  {
    path: 'SecondLevel', component: BasePageComponent, data: {
      filter: MenuItemEnum.SecondLevel
    }
  },
  {
    path: 'Cap', component: BasePageComponent, data: {
      filter: MenuItemEnum.Cap
    }
  },
  {
    path: 'Street', component: BasePageComponent, data: {
      filter: MenuItemEnum.Street
    }
  },
  {
    path: 'Active', component: BasePageComponent, data: {
      filter: MenuItemEnum.Active
    }
  }, {
    path: 'Rules', component: RulesComponent, data: {
      filter: MenuItemEnum.Active
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
