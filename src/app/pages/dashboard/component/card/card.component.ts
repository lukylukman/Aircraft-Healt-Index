import { Component, Input } from '@angular/core';
import { AircraftDTO } from '../../dto/aircraft.dto';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardDashboardComponent {
  @Input() aircraft: AircraftDTO;

  themeColor: string = 'green';
  // @Input() themeColor: 'green' | 'yellow' | 'red';
}
