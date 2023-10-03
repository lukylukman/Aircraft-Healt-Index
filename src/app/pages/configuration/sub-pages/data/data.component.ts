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
import { Observable, Subject, catchError, of, takeUntil, tap } from 'rxjs';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { DashboardFeatureState } from 'src/app/pages/dashboard/states/dashboard.feature';
import { DashboardState } from 'src/app/pages/dashboard/states/dashboard.selector';
import * as DashboardAction from '../../../dashboard/states/dashboard.action'
import Swal from 'sweetalert2';
import { ToastNotif } from '../../../../core/decorators/toast.success';
import { Modal } from 'flowbite';
import { ConfigurationService } from '../../configuration.service';
import { initFlowbite } from 'flowbite';


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
    initFlowbite();
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
        tap((result) => {
          this.listCustomerName = result.data;
          console.log('list CustomerName =>', this.listCustomerName);
        }),
        catchError((err) => {
          console.error(err);
          ToastNotif('error', err);
          return of(null);
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
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
        tap({
          next: (result) => {
            result.data.forEach((configData) =>
              this.store.dispatch(DashboardAction.OnLoadConfigData(configData))
            );
            ToastNotif('success', 'Loaded config value');
            // console.log('data Config =>', result.data);
          },
        }),
        catchError((err) => {
          console.error(err);
          return of(null);
          ToastNotif('error', err);
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  regetConfigData(): void {
    this.store.dispatch(DashboardAction.onClearConfigData());

    this.configurationService
      .getConfigData(this.customerName)
      .pipe(
        tap({
          next: (result) => {
            result.data.forEach((configData) =>
              this.store.dispatch(DashboardAction.OnLoadConfigData(configData))
            );
          },
        }),
        catchError((err) => {
          console.error(err);
          return of(null);
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
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

  uploadFile(file: File, dataType: string): void {
    if (!this.customerName) {
      // Handle the case when no customer name is selected
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Please select a customer!',
        confirmButtonColor: '#225176'
      });
      return;
    }
    if (!file) {
      // Handle the case when no file is selected
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Please select a file!',
        confirmButtonColor: '#225176'
      });
      return;
    }
    if (dataType === 'Select') {
      // Handle the case when no data type is selected
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Please select data type!',
        confirmButtonColor: '#225176'
      });
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

        if (error && error.error && error.error.message) {
          if (Array.isArray(error.error.message)) {
            // Kasus 1: Pesan error dalam bentuk array
            const messages = error.error.message.map((messageItem) => {
              const sheetName = messageItem.sheetName;
              const invalidColumns = messageItem.invalidColumn.map((column) => column['column[F]']);
              return `${sheetName}: ${invalidColumns.join(', ')}`;
            });
            // Lakukan sesuatu dengan pesan-pesan ini
            console.log("Pesan error dalam bentuk array:", messages);
          } else {
            // Kasus 2: Pesan error langsung dalam pesan
            this.errorMessage = error.error.message;
            // Lakukan sesuatu dengan pesan ini
            console.log("Pesan error langsung:", this.errorMessage);
          }
        } else {
          // Penanganan jika tidak ada pesan error yang sesuai dengan yang diharapkan
          console.log("Tidak ada pesan error yang sesuai dengan yang diharapkan.");
        }

        Swal.fire({
          icon: 'warning',
          title: 'Oops!',
          text: `Upload failed!\n${this.errorMessage}`,
          confirmButtonColor: '#225176'
        });
        this.isUploading = false;
        // Handle upload error
        throw error; // Rethrow the error to propagate it further
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
      // Handle the case when no customer name is selected
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Please select a customer!',
        confirmButtonColor: '#225176'
      });
      return;
    }

    this.configurationService
    .restoreConfigValue(this.customerName)
    .pipe(
        tap({
          next: (result) => {
            ToastNotif('success', 'Success Restore Weight');
            this.regetConfigData();
          },
        }),
        catchError((err) => {
          console.error(err);
          ToastNotif('error', 'Failed Restore Weight');
          return of(null);
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  updateConfigWeight(uniqueId: string, configValue: number): void {
    // console.log('Data yang diperbarui =>', uniqueId, configValue);

    this.configurationService.updateConfigWeight(uniqueId, configValue)
      .pipe(
        tap({
          next: (result) => {
            ToastNotif('success', 'Success Update Weight');
            this.regetConfigData();
          },
          error: (err) => {
            console.error(err);
            ToastNotif('error', 'Failed Update Weight');
          },
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  createNewCustomer(): void {
    this.configurationService.createNewCustomer(this.inputNewCs)
      .subscribe(
        (result) => {
          ToastNotif('success', 'Success Added New Customer');
        },
        (error) => {
          console.error(error);
          ToastNotif('error', 'Failed Add New Customer');
        }
      );
  }

}
