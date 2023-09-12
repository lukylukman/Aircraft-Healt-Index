import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { GeneralComponent } from './sub-pages/general/general.component';
import { DataComponent } from './sub-pages/data/data.component';
import { UserComponent } from './sub-pages/user/user.component';
import { PreferencesComponent } from './sub-pages/preferences/preferences.component';
import { SupportComponent } from './sub-pages/support/support.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      {
        path: '', 
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        component: GeneralComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'data',
        component: DataComponent
      },
      {
        path: 'preferences',
        component: PreferencesComponent
      },
      {
        path: 'support',
        component: SupportComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
