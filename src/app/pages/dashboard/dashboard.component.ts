import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  timeout,
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
  private readonly _onDestroy$: Subject<void> = new Subject<void>();

  selectedCard: AircraftDetailHilDTO;
  cardData: AircraftDTO2[] = [];

  logger: LoggerService;

  isSearch: boolean = false;
  isAdvance: boolean = false;
  dataNotFound: boolean = false;
  btnPaggination: boolean = true;
  isModalOpen: boolean = false;

  sortDateSelected: string = '';
  selectedCustomer: string = '';
  customerName: string = '';
  userRoles: string[] = [];
  selectedTypeId: string;

  totalLoadedData: number;
  detailModalHil: AircraftDetailHilDTO[];
  selectedDashboardCard: AircraftDTO;

  selectedCardData: any;
  aircraftDetailModal: Modal;

  paginationData: ImsPaginationDTO = {
    page: 1,
    size: 24,
  };

  dashboardState$: Observable<DashboardFeatureState>;
  personalInformation: PersonalInformation;

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

  ngOnInit(): void {
    // this.fetchAircraftType();
    this.userRoles = this.keycloak.getUserRoles();
    if (
      this.userRoles[0] === 'customer_ga' ||
      this.userRoles[0] === 'customer_citilink'
    ) {
      this.selectedCustomer = this.userRoles[0];
    } else {
      this.selectedCustomer = '';
    }
    this.fectDashboardData2(
      this.selectedTypeId,
      this.sortDateSelected,
      this.selectedCustomer
    );
    this.initDashboardData(undefined, this.selectedCustomer);
    // console.log(this.selectedCustomer);
  }

  formGroup = new FormGroup({
    partNumber: new FormControl<string>('', [Validators.required]),
    searchCategory: new FormControl('ahi-master-*'),
  });

  onSelectDataByCustomerName(customerName: string): void {
    this.paginationData.size = 24;
    this.selectedCustomer = customerName;
    if (this.selectedCustomer) {
      this.selectedTypeId = '';
    }
    this.initDashboardData(
      this.sortDateSelected,
      this.selectedCustomer,
      this.selectedTypeId
    );
    this.fectDashboardData2(
      this.sortDateSelected,
      this.selectedCustomer,
      this.selectedTypeId
    );
  }

  onAircraftTypeChanged(aircraftTypeId: string): void {
    this.paginationData.size = 24;
    this.selectedTypeId = aircraftTypeId;
    this.initDashboardData(
      this.sortDateSelected,
      this.selectedCustomer,
      this.selectedTypeId
    );
    this.fectDashboardData2(
      this.sortDateSelected,
      this.selectedCustomer,
      this.selectedTypeId
    );
  }

  onInputSortDate(sortDate: string): void {
    this.sortDateSelected = sortDate;
    this.paginationData.size = 24;
    this.initDashboardData(
      this.sortDateSelected,
      this.selectedCustomer,
      this.selectedTypeId
    );
    this.fectDashboardData2(
      this.sortDateSelected,
      this.selectedCustomer,
      this.selectedTypeId
    );
  }

  // fetchAircraftType(): void {
  //   this.dashboardService
  //     .getAircraftType()
  //     .pipe(
  //       catchError((err) => {
  //         console.error(err);
  //         return EMPTY;
  //       }),
  //       mergeMap((result) => {
  //         if (result !== null) {
  //           return from(result.data);
  //         } else {
  //           return EMPTY; // Return an empty observable if result is null
  //         }
  //       }),
  //       tap((acType) => {
  //         this.store.dispatch(DashboardAction.onLoadAircraftType(acType));
  //       }),
  //       takeUntil(this._onDestroy$)
  //     )
  //     .subscribe();
  // }

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
  //             .pipe(takeUntil(this._onDestroy$))
  //             .subscribe();
  //         });
  //       }),
  //       takeUntil(this._onDestroy$)
  //     )
  //     .subscribe();
  // }

  fectDashboardData2(
    sortDate?: string,
    customer?: string,
    aircraftTypeId?: string
  ): void {
    this.store.dispatch(DashboardAction.onClearAircraftList());

    this.dashboardService
      .getCardData(this.paginationData, sortDate, customer, aircraftTypeId)
      .pipe(
        timeout(20000),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            // Tangani aksi jika waktu maksimum tercapai
            this.dataNotFound = true;
            console.error('Request timed out...');
            ToastNotif('error', 'Request timed out!');
            // Lakukan tindakan atau hentikan proses yang sedang berjalan
            // ...
          } else if (error.status === 503 || error.status === 404) {
            this.dataNotFound = true;
            console.error('Data not found...');
            ToastNotif('info', 'Data not found!');
          }
          return of(); // Mengembalikan observable kosong setelah menangani kesalahan
        }),
        mergeMap((res) => {
          this.totalLoadedData = res.data.length;
          return res.data;
        }),
        tap((tempAircraft) => {
          this.cardData = this.cardData.concat(tempAircraft); // Menambahkan data ke array yang ada
          this.store.dispatch(DashboardAction.onLoadAircraftList(tempAircraft));
          ToastNotif(
            'success',
            `contains a total of ${this.totalLoadedData} data`
          );
          this.dataNotFound = false;
          if (this.totalLoadedData == this.paginationData.size) {
            this.btnPaggination = true;
          } else {
            this.btnPaggination = false;
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  loadMoreData(): void {
    this.paginationData.size += 24;
    this.fectDashboardData2(
      this.sortDateSelected,
      this.selectedCustomer === '' ? this.customerName : this.selectedCustomer,
      this.selectedTypeId
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
        timeout(20000),
        catchError((err) => {
          console.error(
            'Error on DashboardComponent get detailAircraft => ',
            err
          );
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
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  fetchApuData(aircraftRegistration: string, sortDate?: string): void {
    this.store.dispatch(DashboardAction.onClearApu());

    this.dashboardService
      .getApu(aircraftRegistration, sortDate)
      .pipe(
        timeout(20000),
        catchError((err) => {
          console.error('Error on DashboardComponent get APU => ', err);
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
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  // summaryScore, averageHealt, PercentageScore, Difference
  async initDashboardData(
    sortDate?: string,
    customer?: string,
    aircraftTypeId?: string
  ): Promise<void> {
    this.store.dispatch(DashboardAction.onClearSummaryScore());

    this.dashboardService
      .getAhiSummaryScore(sortDate, customer, aircraftTypeId)
      .pipe(
        timeout(20000),
        catchError((error) => {
          console.error(
            'Error on DashboardComponent get summryScore => ',
            error
          );
          return EMPTY;
        }),
        tap((result) => {
          this.initAveragehealth(sortDate, customer, aircraftTypeId);
          this.initPercentageScoreData(sortDate, customer, aircraftTypeId);
          this.initDifference(sortDate, customer, aircraftTypeId);
          this.store.dispatch(DashboardAction.onLoadSummaryScore(result.data));
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  // Percentage
  async initPercentageScoreData(
    sortDate?: string,
    customer?: string,
    aircraftTypeId?: string
  ): Promise<void> {
    this.store.dispatch(DashboardAction.onClearAveragePercentage());

    this.dashboardService
      .getAveragePersen(sortDate, customer, aircraftTypeId)
      .pipe(
        timeout(20000),
        catchError((error) => {
          console.error(
            'Error on DasboardComponent get averagepercent => ',
            error
          );
          return EMPTY;
        }),
        tap((result) => {
          const temp: AverageHealt = {
            data: result.data,
          };
          this.store.dispatch(DashboardAction.onLoadAveragePercentage(temp));
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  // Average Healt
  async initAveragehealth(
    sortDate?: string,
    customer?: string,
    aircraftTypeId?: string
  ): Promise<void> {
    this.store.dispatch(DashboardAction.onClearAverageHealth());

    this.dashboardService
      .getAverageHealt(sortDate, customer, aircraftTypeId)
      .pipe(
        timeout(20000),
        catchError((error) => {
          console.error(
            'Error on DasboardComponent get averageHealth => ',
            error
          );
          return EMPTY;
        }),
        tap((result) => {
          const temp: AverageHealt = {
            data: result.data,
          };
          this.store.dispatch(DashboardAction.onLoadAverageHealth(temp));
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  // Difference value
  async initDifference(
    sortDate?: string,
    customer?: string,
    aircraftTypeId?: string
  ): Promise<void> {
    this.store.dispatch(DashboardAction.ocClearDifference());

    this.dashboardService
      .getDifference(sortDate, customer, aircraftTypeId)
      .pipe(
        timeout(20000),
        catchError((error) => {
          console.error('Error on DasboardComponent get Difference => ', error);
          return EMPTY;
        }),
        tap((result) => {
          const temp: AverageHealt = {
            data: result.data,
          };
          this.store.dispatch(DashboardAction.onLoadDifference(temp));
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
    this.store.dispatch(DashboardAction.resetDashboardState());
  }
}
