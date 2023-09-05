import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chip[text]',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class ChipComponent implements OnInit {

  @Input() color: string = '';
  @Input() text: string = 'no data';

  colorClass: string = "bg-tms-blue-500 text-white p-3 mr-2 rounded-md";

  ngOnInit(): void {
    this.setColor();
  }

  setColor(): void {
    switch(this.color) {

      case 'primary': {
        this.colorClass = "bg-tms-blue-400 text-white p-2 mr-2";
        break;
      }

      case 'secondary': {
        this.colorClass = "bg-tms-slate-500 text-white p-2 mr-2";
        break;
      }

      case 'warning': {
        this.colorClass = "bg-tms-warning-500 text-white p-2 mr-2";
        break;
      }

      case 'error': {
        this.colorClass = "bg-tms-error-500 text-white p-2 mr-2";
        break;
      }

      default: {
        this.colorClass = "bg-tms-blue-400 text-white p-2 mr-2";
        break;
      }
    }
  }
  
}
