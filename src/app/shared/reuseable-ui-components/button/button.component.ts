import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import collect from 'collect.js';
import { HeroIconName } from 'ng-heroicon';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() isDisabled: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' | 'full' | undefined = 'medium';
  @Input() color:
    | 'primary'
    | 'secondary'
    | 'warning'
    | 'error'
    | 'success'
    | undefined = 'primary';
  @Input() round:
    | 'small'
    | 'medium'
    | 'large'
    | 'extra'
    | 'full'
    | 'extra-large'
    | undefined = 'medium'; //small, medium, large, extra-large, full
  @Input() icon: HeroIconName = <HeroIconName>{};
  @Input() customStyle: string = '';
  @Input() customHeroStyle: string = '';
  @Input() outline: boolean = false;
  @Input() disableTerm: boolean = false;
  @Output() onButtonClick: EventEmitter<void> = new EventEmitter<void>();

  // CSS Class
  colorClass: string = '';
  sizeClass: string = '';
  roundClass: string = '';
  heroStyle: string = '';
  heroContainer: string = '';
  // End of CSS Class

  constructor() {}

  onClick(): void {
    this.onButtonClick.emit();
  }

  ngOnInit(): void {
    this.setRound();
    this.setSize();
    this.setColor();
  }

  setRound(): void {
    switch (this.round) {
      case 'small': {
        this.roundClass = ' rounded-sm ';
        break;
      }
      case 'medium': {
        this.roundClass = ' rounded-md ';
        break;
      }
      case 'large': {
        this.roundClass = ' rounded-lg ';
        break;
      }
      case 'extra-large': {
        this.roundClass = ' rounded-2xl ';
        break;
      }
      case 'full': {
        this.roundClass = ' rounded-full ';
        break;
      }
    }
  }

  setSize(): void {
    switch (this.size) {
      case 'medium': {
        if (this.icon === <HeroIconName>{}) {
          this.sizeClass =
            ' px-3 h-8 py-2 text-sm md:text-xs whitespace-nowrap w-auto ';
          this.heroContainer = ' mr-2 h-4 w-4 ';
        } else {
          this.sizeClass =
            ' px-3 h-8 pr-4 py-2 text-sm md:text-xs whitespace-nowrap w-auto ';
          this.heroContainer = ' mr-2 h-4 w-4 ';
        }
        break;
      }
      case 'large': {
        this.sizeClass = ' px-8 h-12 text-lg font-semibold w-auto ';
        this.heroContainer = ' mr-4 h-6 w-6 ';
        break;
      }
      case 'full': {
        this.sizeClass = ' text-lg font-bold w-full px-4 py-2 ';
        this.heroContainer = ' mr-2 h-5 font-bold w-5 ';
        break;
      }
      case 'small': {
        this.sizeClass = ' px-2 h-6 py-2 text-xs w-auto ';
        this.heroContainer = 'mr-2 h-3 w-3 ';
        break;
      }
    }
  }

  setColor(): void {
    switch (this.color) {
      case 'primary': {
        this.colorClass =
          ' bg-ahi-blue-500 text-white hover:bg-ahi-blue-600 text-ahi-neutral-50 ';
        this.heroStyle = ' text-ahi-neutral-50 ';
        break;
      }
      case 'secondary': {
        this.colorClass =
          ' bg-ahi-neutral-50 hover:bg-ahi-neutral-100 text-ahi-neutral-800 border border-ahi-neutral-800 ';
        this.heroStyle = ' text-ahi-blue-500 ';
        break;
      }
      case 'warning': {
        this.colorClass =
          ' bg-ahi-warning-500 hover:bg-ahi-warning-600 font-jakarta text-white ';
        this.heroStyle = ' text-white ';
        break;
      }
      case 'error': {
        this.colorClass = ' bg-ahi-error-700 hover:bg-ahi-error-800 text-white';
        this.heroStyle = ' text-white ';
        break;
      }
      case 'success': {
        this.colorClass =
          ' bg-ahi-green-600 hover:bg-ahi-green-700 text-white ';
        this.heroStyle = ' text-white ';
        break;
      }
      default: {
        this.colorClass =
          ' bg-ahi-blue-500 text-white hover:bg-ahi-blue-600 text-ahi-neutral-50 ';
        this.heroStyle = ' text-ahi-neutral-50 ';
        break;
      }
    }
  }

  isIconEmpty() {
    return collect(this.icon).isNotEmpty();
  }
}
