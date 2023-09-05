import { Component, Input, OnInit } from '@angular/core';
import { HeroIconName } from 'ng-heroicon';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  
  @Input() title: string = 'Alert Title!';
  @Input() description: string = 'Alert description';
  @Input() color: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | undefined = 'primary';
  @Input() icon: HeroIconName= <HeroIconName>{};

  heroStyle: string = '';
  colorClass: string = '';

  ngOnInit(): void {
    this.setColor();
  }

  setColor(): void {
    switch(this.color) {
      case 'primary': {
        this.colorClass = " text-dbx-blue-800 border border-dbx-blue-300 bg-dbx-blue-50 ";
        this.heroStyle = " text-dbx-blue-800 "
        break;
      }
      case 'secondary': {
        this.colorClass = " text-dbx-neutral-800 border border-dbx-neutral-300 bg-dbx-neutral-50 ";
        this.heroStyle = " text-dbx-neutral-800 "
        break;
      }
      case 'warning': {
        this.colorClass = " text-dbx-warning-800 border border-dbx-warning-300 bg-dbx-warning-50 ";
        this.heroStyle = " text-dbx-warning-800 "
        break;
      }
      case 'error': {
        this.colorClass = " text-dbx-error-800 border border-dbx-error-300 bg-dbx-error-50 ";
        this.heroStyle = " text-dbx-error-800 "
        break;
      }
      case 'success': {
        this.colorClass = " text-green-800 border border-green-300 bg-green-50 ";
        this.heroStyle = " text-green-800 "
        break;
      }
      default: {
        this.colorClass = " text-dbx-blue-800 border border-dbx-blue-300 bg-dbx-blue-50 ";
        this.heroStyle = " text-dbx-blue-800 "
        break;
      }
    }
  }
}
