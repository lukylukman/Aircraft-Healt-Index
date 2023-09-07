import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { QRCodeModule } from 'angularx-qrcode';
import { HeroIconModule } from 'ng-heroicon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TagInputModule } from 'ngx-chips';
import { DateFnsModule } from 'ngx-date-fns';
import { AuthService } from 'src/app/core/services/auth.service';
import { MediaService } from 'src/app/core/services/media.service';
import { SAPService } from 'src/app/core/services/sap.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeService } from '../home/home.service';
import { MasterDataManagementModule } from '../master-data-management/master-data-management.module';
import { MasterDataManagementService } from '../master-data-management/master-data-management.service';
import { MasterDataManagementFeature } from '../master-data-management/states/master-data-management.feature';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    LetModule,
    PushModule,
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    HeroIconModule,
    ReactiveFormsModule,
    MasterDataManagementModule,
    FormsModule,
    DateFnsModule.forRoot(),
    TagInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxBarcodeModule.forRoot(),
    QRCodeModule,
    StoreModule.forFeature(MasterDataManagementFeature),
  ],
  providers: [
    HomeService,
    MediaService,
    SAPService,
    UserSoeService,
    MasterDataManagementService,
    AuthService,
  ],
})
export class DashboardModule {}
