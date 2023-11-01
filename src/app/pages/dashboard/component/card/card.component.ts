import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AircraftDTO, AircraftDTO2 } from '../../dto/aircraft.dto';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardDashboardComponent implements OnInit, OnDestroy {
  private readonly _onDestroy$: Subject<void> = new Subject<void>();
  @Input() aircraft: AircraftDTO2;

  themeColor: string = 'gray';
  arrowDirection: 'up' | 'down' | 'equal' = 'equal';

  ngOnInit(): void {
    this.onSetArrowDirection();
    this.onSetCardColor();
  }

  onSetArrowDirection(): void {
    if (this.aircraft?.totalScoreDifference > 0) {
      this.arrowDirection = 'up';
    }
    if (this.aircraft?.totalScoreDifference < 0) {
      this.arrowDirection = 'down';
    }
    if (this.aircraft?.totalScoreDifference === 0) {
      this.arrowDirection = 'equal';
    }
  }

  onSetCardColor(): void {
    if (this.aircraft?.totalScore <= 100 && this.aircraft?.totalScore >= 94) {
      this.themeColor = 'green';
    }
    if (this.aircraft?.totalScore <= 93 && this.aircraft?.totalScore >= 75) {
      this.themeColor = 'yellow';
    }
    if (this.aircraft?.totalScore <= 74) {
      this.themeColor = 'red';
    }
    if (this.aircraft?.totalScore === null) {
      this.themeColor = 'gray';
    }
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
