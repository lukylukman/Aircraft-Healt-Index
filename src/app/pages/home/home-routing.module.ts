import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  // {
  //   path: 'home',
  //   children: [
  //     { path: 'tools-data', component: ToolsDataComponent },
  //     { path: 'borrowing-list', component: BorrowingListComponent },
  //     { path: 'print', component: PrintTransactionComponent },
  //     { path: 'master-data', component: MasterDataComponent }],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
