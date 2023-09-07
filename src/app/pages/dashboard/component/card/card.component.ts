import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardDashboardComponent {
  @Input() title: string;
  @Input() count: number;
  @Input() total: number;
  @Input() subtitle: string;
  @Input() time: string;
  @Input() timePeriod: string;
  @Input() date: string;
  @Input() year: string;
  @Input() direction: string; // Add this input property for direction
  @Input() themeColor: 'green' | 'yellow' | 'red';
}
