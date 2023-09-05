import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MasterDataManagementComponent } from "./master-data-management.component";

const routes: Routes = [
  { path: '', component: MasterDataManagementComponent },
  {
    path: 'master-management',
    children: [{ path: '', component: MasterDataManagementComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule],
})
export class MasterDataManagementRoutingModule { }