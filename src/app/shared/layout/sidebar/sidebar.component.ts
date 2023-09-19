import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Input, OnChanges } from '@angular/core';
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
  @Input() options: any[];
  @Input() selectedOption: string;
  @Input() valueOption: string;
  @Input() showOption: string;

  selectOptions: { value: string; label: string }[] = [];

  currentDate: Date = new Date();
  userInfo: PersonalInformation = <PersonalInformation>{};
  dashboardState$: Observable<DashboardFeatureState>;
  localService: LocalStorageServiceInterface;
  sidebarState: ShowHideType = 'hide';
  userRoles: string[] = [];

  private readonly unsubscribe$ = new Subject();

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
    this.userRoles = this.kcService.getUserRoles();

    // TODO: Please use an actual service
    const _tempObject: PersonalInformation =
      this.soeService.getPersonalInformationFromCache();

    this.userInfo = _tempObject;
    console.log(
      '%c CREATORS:',
      'font-weight: bold; font-size: 50px;color: #A6C5ED; text-shadow: 3px 3px 0 rgb(2,135,206) , 6px 6px 0 rgb(4,77,145) , 9px 9px 0 rgb(42,21,113) , 12px 12px 0 rgb(5,148,68)'
    );
    console.log(
      '%c Chonkiboy',
      'font-weight: bold; font-size: 50px;color: #A6C5ED; text-shadow: 3px 3px 0 rgb(2,135,206) , 6px 6px 0 rgb(4,77,145) , 9px 9px 0 rgb(42,21,113) , 12px 12px 0 rgb(5,148,68)'
    );

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

  toggleSidebar(): void {
    this._sidebar.subMenuTitle$.next(
      this.capitalize(this._router.router.url, 2)
    );

    this._router.router.events
      .pipe(takeUntil(this.unsubscribe$))
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
    this.unsubscribe$.unsubscribe();
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
