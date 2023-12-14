import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { LocalStorageServiceInterface } from 'src/app/core/interfaces/localstorage.service.interface';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import {
  RouteHelperService,
  RouteSidebar,
} from 'src/app/core/services/route-helper.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { DashboardFeatureState } from 'src/app/pages/dashboard/states/dashboard.feature';
import { DashboardState } from 'src/app/pages/dashboard/states/dashboard.selector';
import { environment } from 'src/environments/environment';
import { LocalServiceConst } from '../../const/local-service.const';
import {
  PersonalInformation,
  ShowHideType,
  SidebarChildrenGroupMenu,
} from './interfaces/sidebar.interface';
import { SidebarService } from './sidebar.service';
import {
  AircraftDTO,
  AircraftDTO2,
} from 'src/app/pages/dashboard/dto/aircraft.dto';
import { AircraftTypeDTO } from 'src/app/pages/dashboard/dto/aircraft-type.dto';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('showHide', [
      state(
        'show',
        style({
          zIndex: 50,
        })
      ),
      state(
        'hide',
        style({
          zIndex: -50,
        })
      ),
      transition('show => hide', [animate('0.1s')]),
      transition('hide => show', [animate('0.9s')]),
    ]),
  ],
  providers: [DatePipe],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() greenZone: number;
  @Input() yellowZone: number;
  @Input() redZone: number;
  @Input() id: string;
  @Input() valueOption: string;
  @Input() showOption: string;
  @Input() aircraft: AircraftDTO;

  arrowDirection: 'up' | 'down' | 'equal' = 'equal';

  @Output() aircraftTypeSelected = new EventEmitter<string>();
  @Output() sortDate = new EventEmitter<string>();
  @Output() customerName = new EventEmitter<string>();

  selectOptions: { value: string; label: string }[] = [];

  currentDate: Date = new Date();
  userInfo: PersonalInformation = <PersonalInformation>{};
  dashboardState$: Observable<DashboardFeatureState>;
  localService: LocalStorageServiceInterface;
  sidebarState: ShowHideType = 'hide';
  userData: string[] = [];
  userRole: string;
  today: string;
  totalData: number;
  sortDateSelected: string;

  selectedCustomer: string;

  aircraftDataCitilink = [
    {
      aircraftTypeId: 1,
      aircraftType: 'A320',
      aircraftTypeName: 'A320',
      customer: 'customer_citilink',
    },
    {
      aircraftTypeId: 3,
      aircraftType: 'A330',
      aircraftTypeName: 'A330 QG',
      customer: 'customer_citilink',
    },
    {
      aircraftTypeId: 4,
      aircraftType: 'ATR72',
      aircraftTypeName: 'ATR72 QG',
      customer: 'customer_citilink',
    },
    {
      aircraftTypeId: 5,
      aircraftType: 'B737Classic',
      aircraftTypeName: 'B737 Classic',
      customer: 'customer_citilink',
    },
  ];

  aircraftDataGaruda = [
    {
      aircraftTypeId: 2,
      aircraftType: 'A330',
      aircraftTypeName: 'A330',
      customer: 'customer_ga',
    },
    {
      aircraftTypeId: 6,
      aircraftType: 'B737-800',
      aircraftTypeName: 'B737-800',
      customer: 'customer_ga',
    },
    {
      aircraftTypeId: 7,
      aircraftType: 'B777',
      aircraftTypeName: 'B777',
      customer: 'customer_ga',
    },
  ];

  private readonly _onDestroy$: Subject<void> = new Subject<void>();

  public sidebarState$ = new BehaviorSubject<ShowHideType>('hide');
  public subMenuTitle$ = new BehaviorSubject<string>('');
  public sidebarRoute: RouteSidebar[] = [];

  public subMenu!: SidebarChildrenGroupMenu[];
  public activeBasePath: string = '';

  constructor(
    private readonly kcService: KeycloakService,
    private _router: RouteHelperService,
    private _sidebar: SidebarService,
    private readonly soeService: UserSoeService,
    private router: Router,
    private readonly store: Store
  ) {
    this.localService = new LocalstorageService();
    this.dashboardState$ = this.store.select(DashboardState);
  }

  ngOnInit(): void {
    this.userData = this.kcService.getUserRoles();
    this.userRole = this.userData[0];

    const todayDate = new Date();
    this.today = todayDate.toISOString().slice(0, 10);

    this.dashboardState$.subscribe((data: DashboardFeatureState) => {
      const greenItems = data.ahiSummaryScore.amountOfGreenItems;
      const yellowItems = data.ahiSummaryScore.amountOfYellowItems;
      const redItems = data.ahiSummaryScore.amountOfRedItems;
      const totalItems = greenItems + yellowItems + redItems;
      this.totalData = totalItems;
    });

    // TODO: Please use an actual service
    const _tempObject: PersonalInformation =
      this.soeService.getPersonalInformationFromCache();

    this.userInfo = _tempObject;

    RouteHelperService.createSidebarRoute(
      { path: 'master-management', icon: 'database' },
      this._router.router.config
    );

    /**
     *
     *
     *
     */
    this.subMenu = RouteHelperService.groupRoute;
    this.activeBasePath = this._router.getBasePath();
    this.sidebarRoute = RouteHelperService.sidebarRoute;
  }

  capitalize(input: string, nextIndex: number): string {
    const _first = input.substring(1, input.length).charAt(0).toUpperCase();
    return `${_first}${input.slice(nextIndex)}`;
  }

  onAircraftTypeChange(event: any) {
    const selectedValue = event.target.value;
    this.aircraftTypeSelected.emit(selectedValue);
    // console.log(selectedValue);
  }

  onSelectDataByCustomer(event: any) {
    const selectedValue = event.target.value;
    this.customerName.emit(selectedValue);
  }

  getFilteredAircraftData(): any {
    this.userData = this.kcService.getUserRoles();
    this.userRole = this.userData[0];

    if (
      (this.userRole === 'admin' || this.userRole === 'customer_ga') &&
      this.selectedCustomer === 'customer_ga'
    ) {
      return this.aircraftDataGaruda;
    }

    if (
      (this.userRole === 'admin' || this.userRole === 'customer_citilink') &&
      this.selectedCustomer === 'customer_citilink'
    ) {
      return this.aircraftDataCitilink;
    } else if (this.userRole === 'admin') {
      return [...this.aircraftDataGaruda, ...this.aircraftDataCitilink];
    }

    // if (this.userRole === 'admin' && this.selectedCustomer === null) {
    // }

    return null;
  }

  onInputSortDate(event: any) {
    const inputDate = new Date(event.target.value);
    if (!isNaN(inputDate.getTime())) {
      const year = inputDate.getFullYear();
      const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
      const day = inputDate.getDate().toString().padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      this.sortDate.emit(formattedDate);
      this.sortDateSelected = formattedDate;
      // console.log(`Selected date: ${formattedDate}`);
    } else {
      console.log('Invalid date input');
    }
  }

  toggleSidebar(): void {
    this._sidebar.subMenuTitle$.next(
      this.capitalize(this._router.router.url, 2)
    );

    this._router.router.events
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((event: Event) => {
        if (
          event instanceof NavigationStart &&
          this._sidebar.sidebarState$.getValue() === 'show'
        ) {
          this._sidebar.hideSidebar();
        }

        if (
          event instanceof NavigationEnd &&
          this._sidebar.sidebarState$.getValue() === 'hide' &&
          this._router.removeFirstSlash(this._router.router.url).split('/')
            .length <= 1
        ) {
          this.activeBasePath = this._router.removeFirstSlash(event.url);
          setTimeout(() => {
            this.subMenu = RouteHelperService.groupRoute.filter(
              (route) => route.groupBasePath === this._router.getBasePath()
            );
            this._sidebar.showSidebar();
            this._sidebar.subMenuTitle$.next(this.capitalize(event.url, 2));
          }, 200);
        }

        return;
      });

    this._sidebar.toggleSidebar();
  }

  hideSidebar() {
    this._sidebar.hideSidebar();
  }

  showSidebar() {
    this._sidebar.showSidebar();
  }

  getSidebar() {
    return this._sidebar;
  }

  getSidebarCurrentValue() {
    return this._sidebar.sidebarState$.getValue();
  }

  @Confirmable({
    title: 'Logout Confirmation',
    html: 'Are you sure you want to logout?',
    icon: 'question',
  })
  onClickLogout() {
    this.kcService.logout(environment.baseUrl);
    this.localService.removeData(LocalServiceConst.USER_INFO);
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  goHome() {
    this.router.navigate(['/home']);
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
}
