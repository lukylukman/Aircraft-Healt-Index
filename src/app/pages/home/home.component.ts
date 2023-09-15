import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import {
  Subject
} from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { PersonalInformation } from 'src/app/shared/layout/sidebar/interfaces/sidebar.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.4s', style({ opacity: 0 }))]),
    ]),
    trigger('scaleAnimation', [
      state(
        'true',
        style({
          transform: 'scale(1.10)', // Scale to 105%
        })
      ),
      state(
        'false',
        style({
          transform: 'scale(1)', // Default scale (100%)
        })
      ),
      transition('false => true', animate('200ms ease-out')),
      transition('true => false', animate('200ms ease-out')),
    ]),
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject();
  currentDate: Date = new Date();

  logger: LoggerService;
  personalInformation: PersonalInformation;

  userRoles: string[] = [];

  quotes: string[] = [
    "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus. — Alexander Graham Bell",
    'Either you run the day or the day runs you. — Jim Rohn',
    'I’m a greater believer in luck, and I find the harder I work the more I have of it. — Thomas Jefferson',
    'When we strive to become better than we are, everything around us becomes better too. — Paulo Coelho',
    'Opportunity is missed by most people because it is dressed in overalls and looks like work. — Thomas Edison',
    'Setting goals is the first step in turning the invisible into the visible. — Tony Robbins',
    "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it. — Steve Jobs",
  ];
  currentQuote: string = this.quotes[0];
  currentIndex: number = 0;

  constructor(
    private readonly soeService: UserSoeService,
    private readonly keycloakService: KeycloakService,
  ) {
    this.logger = new LoggerService(HomeComponent.name);
    this.personalInformation =
      this.soeService.getPersonalInformationFromCache();
    // console.log(this.personalInformation);
  }

  ngOnInit(): void {
    this.userRoles = this.keycloakService.getUserRoles();

    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
      this.currentQuote = this.quotes[this.currentIndex];
    }, 30000);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  @Confirmable({
    title: 'Logout Confirmation',
    html: 'Are you sure you want to logout?',
    icon: 'question',
  })
  doLogout(): void {
    this.clearStorage();
    this.keycloakService.logout().then(() => this.keycloakService.clearToken());
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
