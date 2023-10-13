import { Component, Input, OnInit } from '@angular/core';
import { AircraftDTO } from '../../dto/aircraft.dto';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardDashboardComponent implements OnInit {
  @Input() aircraft: AircraftDTO;

  themeColor: string = 'gray';
  arrowDirection: 'up' | 'down' | 'equal' = 'equal';

  ngOnInit(): void {
    this.onSetArrowDirection();
    this.onSetCardColor();
  }

  onSetArrowDirection(): void {
    if (this.aircraft.aircraftScore?.totalScoreDifference > 0) {
      this.arrowDirection = 'up';
    }
    if (this.aircraft.aircraftScore?.totalScoreDifference < 0) {
      this.arrowDirection = 'down';
    }
    if (this.aircraft.aircraftScore?.totalScoreDifference === 0) {
      this.arrowDirection = 'equal';
    }
  }

  onSetCardColor(): void {
    if (
      this.aircraft.aircraftScore?.totalScore <= 100 &&
      this.aircraft.aircraftScore?.totalScore >= 94
    ) {
      this.themeColor = 'green';
    }
    if (
      this.aircraft.aircraftScore?.totalScore <= 93 &&
      this.aircraft.aircraftScore?.totalScore >= 75
    ) {
      this.themeColor = 'yellow';
    }
    if (this.aircraft.aircraftScore?.totalScore <= 74) {
      this.themeColor = 'red';
    }
    if (this.aircraft.aircraftScore === null) {
      this.themeColor = 'gray';
    }
  }
}
