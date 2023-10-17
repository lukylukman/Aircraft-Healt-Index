import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { KeycloakService } from 'keycloak-angular';
import { EMPTY, Observable, Subject, catchError, takeUntil, tap } from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { PersonalInformation } from 'src/app/shared/layout/sidebar/interfaces/sidebar.interface';
import { DashboardService } from '../dashboard/dashboard.service';
import { AverageHealt } from '../dashboard/dto/average-healt.dto';
import * as DashboardAction from '../dashboard/states/dashboard.action';
import { DashboardFeatureState } from '../dashboard/states/dashboard.feature';
import { DashboardState } from '../dashboard/states/dashboard.selector';

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
  // State Initializations
  dashboardState$: Observable<DashboardFeatureState>;

  private readonly unsubscribe$ = new Subject();
  currentDate: Date = new Date();
  statusHome: string;

  logger: LoggerService;
  personalInformation: PersonalInformation;

  userRoles: string[] = [];
  customerRole: string = '';

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
    private readonly dashboardService: DashboardService,
    private readonly store: Store
  ) {
    this.logger = new LoggerService(HomeComponent.name);
    this.dashboardState$ = this.store.select(DashboardState);
    this.personalInformation =
      this.soeService.getPersonalInformationFromCache();
    // console.log(this.personalInformation);
  }

  ngOnInit(): void {
    this.userRoles = this.keycloakService.getUserRoles();
      if (this.userRoles[0] === "customer_ga" || this.userRoles[0] === "customer_citilink") {
        this.customerRole = this.userRoles[0];
      } else {
        this.customerRole = '';
      }

    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
      this.currentQuote = this.quotes[this.currentIndex];
    }, 30000);

    this.initDashboardData(undefined, this.customerRole);

    this.dashboardState$.subscribe((data: DashboardFeatureState) => {
      const greenItems = data.ahiSummaryScore.amountOfGreenItems;
      const yellowItems = data.ahiSummaryScore.amountOfYellowItems;
      const redItems = data.ahiSummaryScore.amountOfRedItems;

      const maxScore = Math.max(greenItems, yellowItems, redItems);

      if (maxScore === greenItems) {
        this.statusHome = 'Green';
      } else if (maxScore === yellowItems) {
        this.statusHome = 'Yellow';
      } else if (maxScore === redItems) {
        this.statusHome = 'Red';
      }
    });

    console.log(
      '%c AHI:',
      'font-weight: bold; font-size: 20px;color: #A6C5ED; text-shadow: 3px 3px 0 rgb(2,135,206) , 6px 6px 0 rgb(4,77,145) , 9px 9px 0 rgb(42,21,113) , 12px 12px 0 rgb(5,148,68)'
    );
    console.log(
      '\x1b[1m\x1b[97m\x1b[44mby:\n-FE = Luky, Anton, Surya\n-BE = Faqih, Ravel\x1b[0m'
    );
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

  // summaryScore, averageHealt, PercentageScore, Difference
  initDashboardData(undefined, customer?: string): void {
    this.store.dispatch(DashboardAction.onClearSummaryScore());

    this.dashboardService
      .getAhiSummaryScore(undefined, customer)
      .pipe(
        catchError((error) => {
          console.error('Error on HomeComponent => ', error);
          return EMPTY;
        }),
        tap((result) => {
          this.initAveragehealth(undefined, customer);
          this.initPercentageScoreData(undefined, customer);
          this.initDifference(undefined, customer);
          this.store.dispatch(DashboardAction.onLoadSummaryScore(result.data));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // Percentage
  initPercentageScoreData(undefined, customer?: string): void {
    this.store.dispatch(DashboardAction.onClearAveragePercentage());

    this.dashboardService
      .getAveragePersen(undefined, customer)
      .pipe(
        catchError((error) => {
          console.error('Error on HomeComponent => ', error);
          return EMPTY;
        }),
        tap((result) => {
          const temp: AverageHealt = {
            data: result.data,
          };
          this.store.dispatch(DashboardAction.onLoadAveragePercentage(temp));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // Average Healt
  initAveragehealth(undefined, customer?: string): void {
    this.store.dispatch(DashboardAction.onClearAverageHealth());

    this.dashboardService
      .getAverageHealt(undefined, customer)
      .pipe(
        catchError((error) => {
          console.error('Error on HomeComponent => ', error);
          return EMPTY;
        }),
        tap((result) => {
          const temp: AverageHealt = {
            data: result.data,
          };
          this.store.dispatch(DashboardAction.onLoadAverageHealth(temp));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // Difference value
  initDifference(undefined, customer?: string): void {
    this.store.dispatch(DashboardAction.ocClearDifference());

    this.dashboardService
      .getDifference(undefined, customer)
      .pipe(
        catchError((error) => {
          console.error('Error on HomeComponent => ', error);
          return EMPTY;
        }),
        tap((result) => {
          const temp: AverageHealt = {
            data: result.data,
          };
          this.store.dispatch(DashboardAction.onLoadDifference(temp));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }
}
