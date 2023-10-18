import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  from,
  mergeMap,
  of,
  takeUntil,
  tap,
} from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { DashboardService } from './dashboard.service';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { PersonalInformation } from 'src/app/shared/layout/sidebar/interfaces/sidebar.interface';
import { AircraftDetailHilDTO } from './dto/aircraft-detail-hil.dto';
import { AircraftDTO, AircraftDTO2 } from './dto/aircraft.dto';
import { ImsPaginationDTO } from './dto/ims-pagination.dto';
import * as DashboardAction from './states/dashboard.action';
import { DashboardFeatureState } from './states/dashboard.feature';
import { DashboardState } from './states/dashboard.selector';
import { AverageHealt } from './dto/average-healt.dto';
import { KeycloakService } from 'keycloak-angular';
import { ToastNotif } from 'src/app/core/decorators/toast.success';

export interface SearchSelection {
  key: string;
  value: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly unsubscribe$ = new Subject();

  cardData: AircraftDTO2[] = [];
  logger: LoggerService;
  isSearch: boolean = false;
  isAdvance: boolean = false;
  selectedCard: AircraftDetailHilDTO;
  sortDateSelected: string = '';
  selectedCustomer: string = '';
  dataNotFound: boolean = false;
  userRoles: string[] = [];
  selectedTypeId: number;
  totalLoadedData: number;
  detailModalHil: AircraftDetailHilDTO[];
  selectedDashboardCard: AircraftDTO;
  searchSelections: SearchSelection[] = [
    {
      // TODO: Please enable later. Disabled due to data is not ready yet!
      key: 'ahi-master-tool-data',
      // key: 'ahi-master-*',
      value: 'All',
    },
    {
      key: 'ahi-master-tool-data',
      value: 'Hangar Tools',
    },
    // {
    //   key: 'ahi-master-imte',
    //   value: 'IMTE Tools',
    // },
    // {
    //   key: 'ahi-master-tz-equipment',
    //   value: 'TZ Equipment',
    // },
  ];

  dashboardState$: Observable<DashboardFeatureState>;
  personalInformation: PersonalInformation;

  isModalOpen: boolean = false;
  selectedCardData: any;
  aircraftDetailModal: Modal;

  paginationData: ImsPaginationDTO = {
    page: 1,
    size: 24,
  };

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly soeService: UserSoeService,
    protected readonly keycloak: KeycloakService,
    private readonly store: Store
  ) {
    this.logger = new LoggerService(DashboardComponent.name);
    this.dashboardState$ = this.store.select(DashboardState);
    this.personalInformation =
      this.soeService.getPersonalInformationFromCache();
  }
  ngAfterViewInit(): void {
    this.aircraftDetailModal = new Modal(
      document.getElementById('DetailHil'),
      {}
    );
  }

  formGroup = new FormGroup({
    partNumber: new FormControl<string>('', [Validators.required]),
    searchCategory: new FormControl('ahi-master-*'),
  });

  onAircraftTypeChanged(aircraftTypeId: number): void {
    const aircraftId = Number(aircraftTypeId);
    this.selectedTypeId = aircraftId;
    this.fectDashboardData2(
      this.selectedTypeId,
      this.sortDateSelected,
      this.selectedCustomer
    );
  }

  onInputSortDate(sortDate: string): void {
    this.sortDateSelected = sortDate;
    this.fectDashboardData2(
      this.selectedTypeId,
      this.sortDateSelected,
      this.selectedCustomer
    );
    this.initDashboardData(this.sortDateSelected, this.selectedCustomer);
  }

  ngOnInit(): void {
    this.fetchAircraftType();
    this.userRoles = this.keycloak.getUserRoles();
    if (this.userRoles[0] === "customer_ga" || this.userRoles[0] === "customer_citilink") {
        this.selectedCustomer = this.userRoles[0];
      } else {
        this.selectedCustomer = '';
      }
    this.fectDashboardData2(undefined, undefined, this.selectedCustomer);
    this.initDashboardData( undefined, this.selectedCustomer);
    // console.log(this.selectedCustomer);
  }

  fetchAircraftType(): void {
    this.dashboardService
      .getAircraftType()
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
        mergeMap((result) => {
          if (result !== null) {
            return from(result.data);
          } else {
            return EMPTY; // Return an empty observable if result is null
          }
        }),
        tap((acType) => {
          this.store.dispatch(DashboardAction.onLoadAircraftType(acType));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }
  
  // fectDashboardData(aircraftTypeId?: number, sortDate?: string): void {
  //   this.store.dispatch(DashboardAction.onClearAircraftList());

  //   this.dashboardService
  //     .getCardData(this.paginationData, aircraftTypeId)
  //     .pipe(
  //       tap((res) => {
  //         res.data.forEach((el) => {
  //           this.dashboardService
  //             .getAircraftScore(el.aircraftRegistration, sortDate)

  //             .pipe(
  //               map((score) => {

  //                 let tempAircraft: AircraftDTO = {
  //                   aircraftGroup: el.aircraftGroup,
  //                   sapRegistration: el.sapRegistration,
  //                   aircraftRegistration: el.aircraftRegistration,
  //                   carrierId: el.carrierId,
  //                   blockOnDate: el.blockOnDate,
  //                   blockOnTime: el.blockOnTime,
  //                   arrivalStation: el.arrivalStation,
  //                   aircraftType: el.aircraftType,
  //                   aircraftScore: score.data,
  //                 };

  //                 return tempAircraft;
  //               }),
  //               catchError((error) => {

  //                 console.error('An error occurred:', error);

  //                 return of({
  //                   aircraftGroup: el.aircraftGroup,
  //                   sapRegistration: el.sapRegistration,
  //                   aircraftRegistration: el.aircraftRegistration,
  //                   carrierId: el.carrierId,
  //                   blockOnDate: el.blockOnDate,
  //                   blockOnTime: el.blockOnTime,
  //                   arrivalStation: el.arrivalStation,
  //                   aircraftType: el.aircraftType,
  //                   aircraftScore: null,
  //                 });
  //               })
  //             )
  //             .pipe(
  //               tap((_) => {
  //                 this.cardData.push(_);
  //                 this.store.dispatch(DashboardAction.onLoadAircraftList(_));
  //               })
  //             )
  //             .pipe(takeUntil(this.unsubscribe$))
  //             .subscribe();
  //         });
  //       }),
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe();
  // }

  fectDashboardData2(
    aircraftTypeId?: number,
    sortDate?: string,
    customer?: string
  ): void {
    this.store.dispatch(DashboardAction.onClearAircraftList());

    this.dashboardService
      .getCardData(this.paginationData, sortDate, customer, aircraftTypeId)
      .pipe(
        catchError((error) => {
          if (error.status === 503 || error.status === 404) {
            this.dataNotFound = true;
            console.error('Data for today not found...');
            ToastNotif('info', `Data not found for this day!`);
          }
          return of();
        }),
        mergeMap((res) => {
          this.totalLoadedData = res.data.length;
          return res.data;
        }),
        tap((tempAircraft) => {
          this.cardData = this.cardData.concat(tempAircraft); // Menambahkan data ke array yang ada
          this.store.dispatch(DashboardAction.onLoadAircraftList(tempAircraft));
          ToastNotif('success', `contains a total of ${this.totalLoadedData} data`);
          this.dataNotFound = false;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  loadMoreData(): void {
      this.paginationData.size += 24;
      this.fectDashboardData2(
      this.selectedTypeId,
      this.sortDateSelected,
      this.selectedCustomer
    );
  }

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  //   const pageHeight = document.documentElement.scrollHeight;
  //   const windowHeight = window.innerHeight;

  //   if (scrollPosition + windowHeight >= pageHeight) {
  //     this.paginationData.size += 24;
  //     this.fectDashboardData2(undefined, undefined, this.selectedCustomer);
  //   }
  // }

  onClickDetailAircraft(): void {
    this.aircraftDetailModal.show();
  }

  onClickHidetailAircraftDetailModal() {
    this.aircraftDetailModal.hide();
  }

  openCardDetail(aircraft: AircraftDTO2): void {
    this.onClickDetailAircraft();
    this.store.dispatch(DashboardAction.onDashboardClearSelected());
    this.store.dispatch(DashboardAction.onClearAircraftDetailHil());

    this.dashboardService
      .getDetailAicraft(aircraft.aircraftRegistration)
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
        tap((result) => {
          if (result !== null) {
            // Handle response
            if (result.data.length === 0) {
              throw Error('There is no data');
            }
            this.selectedCard = result.data[0];
            this.store.dispatch(DashboardAction.onDashboardSelected(aircraft));
            this.store.dispatch(
              DashboardAction.onLoadAircraftDetailHil({ data: result.data })
            );
            this.fetchApuData(
              aircraft.aircraftRegistration,
              this.sortDateSelected
            );
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  fetchApuData(aircraftRegistration: string, sortDate?: string): void {
    this.store.dispatch(DashboardAction.onClearApu());

    this.dashboardService
      .getApu(aircraftRegistration, sortDate)
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
        tap((result) => {
          if (result !== null) {
            // Pastikan tidak ada error sebelum melanjutkan
            const apuRecord = result.data.record.apuRecord;
            // console.log('Data APU => ', result.data.record.apuRecord);
            this.store.dispatch(DashboardAction.onLoadApu({ data: apuRecord }));
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // summaryScore, averageHealt, PercentageScore, Difference
  initDashboardData(sortDate?: string, customer?: string): void {
    this.store.dispatch(DashboardAction.onClearSummaryScore());

    this.dashboardService
      .getAhiSummaryScore(sortDate, customer)
      .pipe(
        catchError((error) => {
          console.error('Error on HomeComponent => ', error);
          return EMPTY;
        }),
        tap((result) => {
          this.initAveragehealth(sortDate, customer);
          this.initPercentageScoreData(sortDate, customer);
          this.initDifference(sortDate, customer);
          this.store.dispatch(DashboardAction.onLoadSummaryScore(result.data));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // Percentage
  initPercentageScoreData(sortDate?: string, customer?: string): void {
    this.store.dispatch(DashboardAction.onClearAveragePercentage());

    this.dashboardService
      .getAveragePersen(sortDate, customer)
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
  initAveragehealth(sortDate?: string, customer?: string): void {
    this.store.dispatch(DashboardAction.onClearAverageHealth());

    this.dashboardService
      .getAverageHealt(sortDate, customer)
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
  initDifference(sortDate?: string, customer?: string): void {
    this.store.dispatch(DashboardAction.ocClearDifference());

    this.dashboardService
      .getDifference(sortDate, customer)
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

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
    this.store.dispatch(DashboardAction.resetDashboardState());
  }
}
