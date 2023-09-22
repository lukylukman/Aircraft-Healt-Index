import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgIconComponent {
  @Input() width = '32';
  @Input() height = '59';
  @Input() direction = 'up';
  @Input() greenColor = false; // Tambahkan atribut ini

  getPath(): string {
    if (this.direction === 'up') {
      return 'M19 2.5L35.4545 62.5H2.54552L19 2.5Z';
    } else if (this.direction === 'down') {
      return 'M19 66.5L35.4545 6.5H2.54552L19 66.5Z';
    } else {
      // Default to 'up' if direction is not recognized
      return 'M19 2.5L35.4545 62.5H2.54552L19 2.5Z';
    }
  }
}
