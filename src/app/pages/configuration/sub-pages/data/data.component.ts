import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, AfterContentInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, Subject, catchError, map, mergeMap, of, take, takeUntil, tap } from 'rxjs';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { DashboardFeatureState } from 'src/app/pages/dashboard/states/dashboard.feature';
import { DashboardState } from 'src/app/pages/dashboard/states/dashboard.selector';
import * as DashboardAction from '../../../dashboard/states/dashboard.action'
import Swal from 'sweetalert2';
import { ToastNotif } from '../../../../core/decorators/toast.success';
import { Modal } from 'flowbite';
import { ConfigurationService } from '../../configuration.service';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.4s', style({ opacity: 0 }))]),
    ]),
    trigger('scaleAnimation', [
      state(
        'true',
        style({
          transform: 'scale(1.10)', // Scale to 105%
        })
      ),
      state(
        'false',
        style({
          transform: 'scale(1)', // Default scale (100%)
        })
      ),
      transition('false => true', animate('200ms ease-out')),
      transition('true => false', animate('200ms ease-out')),
    ]),
  ],
})
export class DataComponent implements OnInit, OnDestroy, AfterContentInit {
  showUpdate: boolean = true;
  showCalculation: boolean = false;
  AddDataForm;

  hilScore: number = 0;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  customerName: string = '';
  selectedOption: string = ''; // Nilai default
  selectedFile: File;
  isRangeAircraftSystem: boolean = false;
  isRangeEngineApu: boolean = false;
  addNewCustomer: Modal;
  inputNewCs: string;
  errorMessage: string = '';
  listCustomerName: [] = [];

  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();
  private readonly unsubscribe$ = new Subject();

  dashboardState$: Observable<DashboardFeatureState>;

  constructor(
    private route: RouteHelperService, // private readonly unsubscribe$ = new Subject()
    private formBuilder: FormBuilder,
    private readonly configurationService: ConfigurationService,
    private readonly store: Store
  ) {
    this.dashboardState$ = this.store.select(DashboardState);
  }
  ngAfterContentInit(): void {
    this.addNewCustomer = new Modal(document.getElementById('addCustomerModal'), {});
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
    this.store.dispatch(DashboardAction.onClearConfigData());
  }

  ngOnInit(): void {
    this.createForm();
    // this.initCustomerListName();
  }

  createForm(): void {
    this.AddDataForm = this.formBuilder.group({
      upload_file: ['', [Validators.required]],
    });
  }

  initCustomerListName(): void {
    this.configurationService
      .getCustomerName()
      .pipe(
        catchError((err) => {
          console.error(err);
          ToastNotif('error', err); // Menampilkan pesan error
          return EMPTY; // Mengembalikan Observable yang menghasilkan nilai null dalam kasus error.
        }),
        tap((result) => {
          if (result !== null) { // Pastikan tidak ada error sebelum melanjutkan
            this.listCustomerName = result.data;
            console.log('list CustomerName =>', this.listCustomerName);
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  openModalAddNewCustomer(): void {
    this.addNewCustomer.show();
  }
  closeModalAddnewCustomer(): void {
    this.addNewCustomer.hide();
  }

  selectCustomer(customerName: string) {
    this.selectedOption = customerName;
    
    switch (customerName) {
      case 'pilihan1':
        this.customerName = 'GA';
        break;
      case 'pilihan2':
        this.customerName = 'CITILINK';
        break;
      default:
        this.customerName = customerName;
    }
    this.getConfigData();
  }

  getConfigData(): void {
    this.store.dispatch(DashboardAction.onClearConfigData());

    this.configurationService
      .getConfigData(this.customerName)
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
        mergeMap(value => value.data),
        tap(value => this.store.dispatch(DashboardAction.OnLoadConfigData(value))),  
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
      ToastNotif('success', 'Loaded config value')
  }
  
  regetConfigData(): void {
    this.store.dispatch(DashboardAction.onClearConfigData());

    this.configurationService
      .getConfigData(this.customerName)
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
        mergeMap(value => value.data),
        tap(value => this.store.dispatch(DashboardAction.OnLoadConfigData(value))),  
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // public selectedFile: File;
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length) {
      const selectedFile = event.target.files[0];
      const allowedExtensions = ['.xls', '.xlsx'];

      const fileName = selectedFile.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        this.selectedFile = selectedFile;
        this.AddDataForm.patchValue({
          upload_file: this.selectedFile.name,
        });
      } else {
        Swal.fire('Oops!', 'Please select a valid Excel file (.xls or .xlsx)!', 'warning');
        event.target.value = '';
      }
    }
  }

  private showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Oops!',
      text: message,
      confirmButtonColor: '#225176'
    });
  }

  uploadFile(file: File, dataType: string): void {
    if (!this.customerName) {
      this.showErrorMessage('Please select a customer!');
      return;
    }
    if (!file) {
      this.showErrorMessage('Please select a file!');
      return;
    }
    if (dataType === 'Select') {
      this.showErrorMessage('Please select data type!');
      return;
    }

    const formData = new FormData();
    formData.append('customerName', this.customerName);
    formData.append('configName', dataType);
    formData.append('file', file);
    this.isUploading = true;

    this.configurationService
    .updateDataConfiguration(formData)
    .pipe(
      catchError((error) => {
        this.errorMessage = '';

        if (error && error.error && error.error.message) {
          if (Array.isArray(error.error.message)) {
            const messages = error.error.message.map((messageItem) => {
              const sheetName = messageItem.sheetName;
              const invalidColumns = messageItem.invalidColumn.map((column) => {
                const columnMessages = Object.keys(column).map((colKey) => {
                  return `<strong>${colKey}:</strong> ${column[colKey]}`;
                });
                return `<p>${columnMessages.join('<br>')}</p>`;
              });
              return `Sheet Name <strong>${sheetName}:</strong> <br>${invalidColumns.join('<br>')}`;
            });
            this.errorMessage = messages.join('<br>');
          } else {
            this.errorMessage = error.error.message;
          }
        } else {
          this.errorMessage = 'Tidak ada pesan error yang sesuai dengan yang diharapkan.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          width: "auto",
          padding: '1em',
          html: `
                <table id="detail" class="table rounded-lg">
                    <thead class="bg-gray-100">
                        <tr>
                            <th>Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="bg-gray-50">${this.errorMessage}</td>
                        </tr>
                    </tbody>
                </table>`,
          confirmButtonColor: '#225176',
          customClass: {
            htmlContainer: 'text-center' // Menambahkan kelas CSS 'text-left'
          }
        });
        this.isUploading = false;
        throw error; 
      })
    )
    .subscribe(
      (progress: number) => {
        this.uploadProgress = progress;
      },
      () => {},
      () => {
        this.isUploading = false;
        this.uploadProgress = 0;

        Swal.fire('Yeaay!', 'Upload success!', 'success');
      }
    );
  }

  // restore config value data 
  restoreConfigValue(): void {
    if (!this.customerName) {
      this.showErrorMessage('Please select a customer!');
      return;
    }

    this.configurationService
      .restoreConfigValue(this.customerName)
      .pipe(
        catchError((err) => {
          console.error(err);
          ToastNotif('error', 'Failed Restore Weight');
          return EMPTY;
        }),
        tap((result) => {
          if (result !== null) {
            ToastNotif('success', 'Success Restore Weight');
            this.regetConfigData();
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  updateConfigWeight(uniqueId: string, configValue: number): void {
    // console.log('Data yang diperbarui =>', uniqueId, configValue);

    this.configurationService
      .updateConfigWeight(uniqueId, configValue)
      .pipe(
        catchError((err) => {
          console.error(err);
          ToastNotif('error', 'Failed Update Weight');
          return EMPTY;
        }),
        tap((result) => {
          if (result !== null) {
            ToastNotif('success', 'Success Update Weight');
            this.regetConfigData();
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  createNewCustomer(): void {
    this.configurationService
      .createNewCustomer(this.inputNewCs)
      .pipe(
        catchError((error) => {
          console.error(error);
          ToastNotif('error', 'Failed Add New Customer');
          return EMPTY;
        }),
        tap((result) => {
          if (result !== null) {
            ToastNotif('success', 'Success Added New Customer');
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

}
