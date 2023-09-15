import { trigger, transition, style, animate, state } from '@angular/animations';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';


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
        }),
      ),
      state(
        'false',
        style({
          transform: 'scale(1)', // Default scale (100%)
        }),
      ),
      transition('false => true', animate('200ms ease-out')),
      transition('true => false', animate('200ms ease-out')),
    ]),
  ],
})
export class DataComponent {

  showUpdate: boolean = true;
  showCalculation: boolean = false;

  hilScore: number = 0;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  customerName: string = '';
  selectedOption: string = ''; // Nilai default


  constructor(
    private route: RouteHelperService, // private readonly unsubscribe$ = new Subject()
    private readonly dashboardService: DashboardService,
    private readonly store: Store,
  ) {
  }

  selectOption(option: string) {
    this.selectedOption = option;
    if (option === 'pilihan1') {
      this.customerName = 'GA';
    } else if (option === 'pilihan2') {
      this.customerName = 'CITILINK';
    }
  }

  uploadFile(file: File, dataType: string): void {
    if (!file) {
      // Handle the case when no file is selected
      alert('Please select a file');
      return;
    }
    if (dataType === 'Select config type') {
      // Handle the case when no data type is selected
      alert('Please select a data type');
      return;
    }
    this.isUploading = true;
    
    this.dashboardService.updateDataConfiguration(file, dataType, this.customerName).subscribe(
      (progress: number) => {
        this.uploadProgress = progress;
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        this.isUploading = false;
        this.uploadProgress = 0;
        console.log('upload success');
      }
    );
  }

}
