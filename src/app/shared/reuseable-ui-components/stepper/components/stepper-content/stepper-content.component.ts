import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { HeroIconName } from 'ng-heroicon';

@Component({
  selector: 'app-stepper-content[title][id][icon]',
  templateUrl: './stepper-content.component.html',
  styleUrls: ['./stepper-content.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate(
          200,
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          200,
          style({ opacity: 0, transform: 'translateX(-100px)' })
        )
      ])
    ]),
    trigger('fadeSlideTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100px)' }),
        animate(
          300,
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          300,
          style({ opacity: 0, transform: 'translateY(-100px)' })
        )
      ])
    ]),
  ]
})
export class StepperContentComponent {
  @Input() title?: string;
  @Input() id?: string;
  @Input() active: boolean = false;
  @Input() isCloseable = false;
  @Input() desc?: string;
  @Input() icon: HeroIconName = 'briefcase';
  @Input() template: any;
  @Input() dataContext: any;
}
