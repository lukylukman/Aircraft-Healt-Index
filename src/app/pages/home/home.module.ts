import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@ngrx/component';
import { HeroIconModule } from 'ng-heroicon';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    LetModule,
    PushModule,
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    HeroIconModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    HomeService,
    UserSoeService,
    AuthService,
  ],
})
export class HomeModule {}
