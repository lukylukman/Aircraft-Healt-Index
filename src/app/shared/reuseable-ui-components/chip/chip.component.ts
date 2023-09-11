import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chip[text]',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css'],
})
export class ChipComponent implements OnInit {
  @Input() color: string = '';
  @Input() text: string = 'no data';

  colorClass: string = 'bg-ahi-blue-500 text-white p-3 mr-2 rounded-md';

  ngOnInit(): void {
    this.setColor();
  }

  setColor(): void {
    switch (this.color) {
      case 'primary': {
        this.colorClass = 'bg-ahi-blue-400 text-white p-2 mr-2';
        break;
      }

      case 'secondary': {
        this.colorClass = 'bg-ahi-slate-500 text-white p-2 mr-2';
        break;
      }

      case 'warning': {
        this.colorClass = 'bg-ahi-warning-500 text-white p-2 mr-2';
        break;
      }

      case 'error': {
        this.colorClass = 'bg-ahi-error-500 text-white p-2 mr-2';
        break;
      }

      default: {
        this.colorClass = 'bg-ahi-blue-400 text-white p-2 mr-2';
        break;
      }
    }
  }
}
