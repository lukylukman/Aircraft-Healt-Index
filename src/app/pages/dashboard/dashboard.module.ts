import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { HeroIconModule } from 'ng-heroicon';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardDashboardComponent } from './component/card/card.component';
import { DetailCardComponent } from './component/detail-card/detail-card.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardFeature } from './states/dashboard.feature';

@NgModule({
  declarations: [
    DashboardComponent,
    CardDashboardComponent,
    DetailCardComponent,
  ],
  imports: [
    LetModule,
    PushModule,
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    HeroIconModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature(DashboardFeature),
  ],
  providers: [
    UserSoeService,
    AuthService,
  ],
})
export class DashboardModule {}
