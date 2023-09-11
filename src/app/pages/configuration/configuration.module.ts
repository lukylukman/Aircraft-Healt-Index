import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeroIconModule } from 'ng-heroicon';

@NgModule({
  imports: [
    CommonModule, ConfigurationRoutingModule, SharedModule, HeroIconModule
  ],
  declarations: [ConfigurationComponent]
})
export class ConfigurationModule { }
