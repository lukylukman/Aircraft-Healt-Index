import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeroIconModule } from 'ng-heroicon';
import { GeneralComponent } from './sub-pages/general/general.component';
import { UserComponent } from './sub-pages/user/user.component';
import { DataComponent } from './sub-pages/data/data.component';
import { PreferencesComponent } from './sub-pages/preferences/preferences.component';
import { SupportComponent } from './sub-pages/support/support.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { DashboardFeature } from '../dashboard/states/dashboard.feature';
import { AddCustomerModalComponent } from './sub-pages/data/component/addCustomerModal/addCustomerModal.component';

@NgModule({
  imports: [
    CommonModule, ConfigurationRoutingModule, SharedModule, HeroIconModule, FormsModule, StoreModule.forFeature(DashboardFeature),
  ],
  declarations: [ConfigurationComponent, GeneralComponent, UserComponent, DataComponent, PreferencesComponent, SupportComponent, AddCustomerModalComponent]
})
export class ConfigurationModule { }
