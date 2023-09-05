import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LetModule, PushModule } from "@ngrx/component";
import { StoreModule } from "@ngrx/store";
import { HeroIconModule } from "ng-heroicon";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { AddStoreModalComponent } from "./components/add-store-modal/add-store-modal.component";
import { EditStoreModalComponent } from "./components/edit-store-modal/edit-store-modal.component";
import { MasterDataManagementComponent } from "./master-data-management.component";
import { MasterDataManagementRoutingModule } from "./master-data-management.routing.module";
import { MasterDataManagementService } from "./master-data-management.service";
import { MasterDataManagementFeature } from "./states/master-data-management.feature";
import { MasterDataManagementDashboardComponent } from "./sub-pages/master-data-management-dashboard/master-data-management-dashboard.component";

@NgModule({
    declarations: [
        MasterDataManagementComponent,
        MasterDataManagementDashboardComponent,
        AddStoreModalComponent,
        EditStoreModalComponent,
    ],
    imports: [
        CommonModule,
        LetModule,
        PushModule,
        MasterDataManagementRoutingModule,
        SharedModule,
        HeroIconModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forFeature(MasterDataManagementFeature),
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        MasterDataManagementService,
    ]
})
export class MasterDataManagementModule { }