import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, NgModel, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';
import Swal from 'sweetalert2';

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
export class DataComponent implements OnInit, OnDestroy {
  showUpdate: boolean = true;
  showCalculation: boolean = false;
  AddDataForm;

  hilScore: number = 0;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  customerName: string = '';
  selectedOption: string = ''; // Nilai default
  selectedFile: File;
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private route: RouteHelperService, // private readonly unsubscribe$ = new Subject()
    private formBuilder: FormBuilder,
    private readonly dashboardService: DashboardService,
    private readonly store: Store
  ) {}

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.AddDataForm = this.formBuilder.group({
      upload_file: ['', [Validators.required]],
    });
  }

  selectOption(option: string) {
    this.selectedOption = option;
    if (option === 'pilihan1') {
      this.customerName = 'GA';
    } else if (option === 'pilihan2') {
      this.customerName = 'CITILINK';
    }
  }

  // public selectedFile: File;
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];
      this.AddDataForm.patchValue({
        upload_file: this.selectedFile.name,
      });
    }
  }

  uploadFile(file: File, dataType: string): void {
    if (!file) {
      // Handle the case when no file is selected
      // alert('Please select a file');
      Swal.fire('Oops!', 'Please select a file!', 'warning');
      return;
    }
    if (dataType === 'Select config type') {
      // Handle the case when no data type is selected
      // alert('Please select a data type');
      Swal.fire('Oops!', 'Please select a data type!', 'warning');
      return;
    }
    this.isUploading = true;

    this.dashboardService
      .updateDataConfiguration(file, dataType, this.customerName)
      .subscribe(
        (progress: number) => {
          this.uploadProgress = progress;
        },
        (error) => {
          Swal.fire('Oops!', 'Upload failed!', 'warning');
          // console.error('Upload failed:', error);
        },
        () => {
          this.isUploading = false;
          this.uploadProgress = 0;

          // TODO
          // Kirim formData lewat component aja
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          formData.append('customerName', this.customerName);

          Swal.fire('Yeaay!', 'Upload success!', 'success');
          // console.log('upload success');
        }
      );
  }
}
