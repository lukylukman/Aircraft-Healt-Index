import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastNotif } from 'src/app/core/decorators/toast.success';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './addNewUserModal.component.html',
  styleUrls: ['./addNewUserModal.component.css']
})
export class AddNewCustomerModalComponent implements OnInit {

  @Output() formSubmitEmitted: EventEmitter<any> = new EventEmitter();

  inputNewCs: string;
  
  constructor(private readonly dashboardService: DashboardService,) {}

  ngOnInit() {
  }
  resetModal() {
  }

  createNewCustomer(): void {
    this.dashboardService.createNewCustomer(this.inputNewCs)
      .subscribe(
        (result) => {
          ToastNotif('success', 'Success Added New Customer');
          this.resetModal();
        },
        (error) => {
          console.error(error);
          ToastNotif('error', 'Failed Add New Customer');
          this.resetModal();
        }
      );
  }
}
