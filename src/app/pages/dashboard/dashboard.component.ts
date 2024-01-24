import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
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
import { KeycloakService } from 'keycloak-angular';
import { ToastNotif } from 'src/app/core/decorators/toast.success';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { PersonalInformation } from 'src/app/shared/layout/sidebar/interfaces/sidebar.interface';
import { AircraftDetailHilDTO } from './dto/aircraft-detail-hil.dto';
import { AircraftDTO, AircraftDTO2 } from './dto/aircraft.dto';
import { AverageHealt } from './dto/average-healt.dto';
import { ImsPaginationDTO } from './dto/ims-pagination.dto';
import * as DashboardAction from './states/dashboard.action';
import { DashboardFeatureState } from './states/dashboard.feature';
import { DashboardState } from './states/dashboard.selector';

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
  btnPaggination: boolean = false;
  isModalOpen: boolean = false;

  sortDateSelected: string = '';
  selectedCustomer: string = '';
  selectedCustomerName: string = '';
  selectedAircraftId: string = '';

  customerName: string = '';
  userRoles: string[] = [];
  selectedTypeId: string;

  totalLoadedData: number;
  detailModalHil: AircraftDetailHilDTO[];
  selectedDashboardCard: AircraftDTO;

  selectedCardData: any;
  aircraftDetailModal: Modal;

  formParam: FormGroup;

  dashboardState$: Observable<DashboardFeatureState>;
  personalInformation: PersonalInformation;

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

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly soeService: UserSoeService,
    protected readonly keycloak: KeycloakService,
    private readonly store: Store,
    private fb: FormBuilder
  ) {
    this.logger = new LoggerService(DashboardComponent.name);
    this.dashboardState$ = this.store.select(DashboardState);
    this.personalInformation =
      this.soeService.getPersonalInformationFromCache();
    this.formFilterOption();
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
      this.formParam.get('customer')?.setValue(this.userRoles[0]);
    } else {
      this.selectedCustomer = '';
    }
    this.fectDashboardData(this.formParam.value);
    this.initDashboardData(this.formParam.value);
  }

  formFilterOption(): void {
    this.formParam = this.fb.group({
      page: [1],
      size: [24],
      endDate: [''],
      customer: [''],
      aircraftTypeId: [''],
    });
  }

  resetFormFilter(): void {
    this.formParam.reset();
  }

  onSelectDataByCustomerName(customerName: string): void {
    this.selectedCustomerName = customerName;
    this.formParam.get('customer')?.setValue(customerName);
    this.formParam.get('size')?.setValue('24');

    this.formParam
      .get('aircraftTypeId')
      ?.setValue(this.getAircraftTypeById(this.selectedAircraftId));

    if (this.formParam.get('customer')?.value) {
      const customer = this.formParam.get('customer')?.value;

      if (customer === 'customer_ga') {
        if (['1', '3', '4', '5'].includes(this.selectedAircraftId)) {
          this.formParam.get('aircraftTypeId')?.setValue('');
        }
      } else if (customer === 'customer_citilink') {
        if (['2', '6', '7'].includes(this.selectedAircraftId)) {
          this.formParam.get('aircraftTypeId')?.setValue('');
        }
      }
      this.fectDashboardData(this.formParam.value);
      this.initDashboardData(this.formParam.value);
    } else {
      let customerValue = '';

      if (['1', '3', '4', '5'].includes(this.selectedAircraftId)) {
        customerValue = 'customer_citilink';
      } else if (['2', '6', '7'].includes(this.selectedAircraftId)) {
        customerValue = 'customer_ga';
      }
      // Set the customer value in the form
      this.formParam.get('customer')?.setValue(customerValue);
      this.fectDashboardData(this.formParam.value);
      this.initDashboardData(this.formParam.value);
    }
  }

  onAircraftTypeChanged(aircraftTypeId: string): void {
    const aircraftType = this.getAircraftTypeById(aircraftTypeId);

    this.selectedAircraftId = aircraftTypeId;
    // Set values in the form
    this.formParam.get('aircraftTypeId')?.setValue(aircraftType);
    this.formParam.get('customer')?.setValue('');
    this.formParam.get('size')?.setValue('24');
    let customerValue = '';

    if (['1', '3', '4', '5'].includes(aircraftTypeId)) {
      customerValue = 'customer_citilink';
    } else if (['2', '6', '7'].includes(aircraftTypeId)) {
      customerValue = 'customer_ga';
    } else if (this.formParam.get('customer').value === null) {
      customerValue = '';
    } else if (this.formParam.get('aircraftTypeId').value === '') {
      if (this.userRoles[0] === 'admin') {
        customerValue = this.selectedCustomerName;
      } else {
        customerValue = this.userRoles[0];
      }
    }
    // Set the customer value in the form
    this.formParam.get('customer')?.setValue(customerValue);

    // Fetch and initialize dashboard data
    this.fectDashboardData(this.formParam.value);
    this.initDashboardData(this.formParam.value);
  }

  getAircraftTypeById(aircraftTypeId: string): string {
    const foundAircraft = this.aircraftDataCitilink
      .concat(this.aircraftDataGaruda)
      .find(
        (aircraft) => aircraft.aircraftTypeId.toString() === aircraftTypeId
      );

    return foundAircraft ? foundAircraft.aircraftType : '';
  }

  onInputSortDate(sortDate: string): void {
    console.log(sortDate, 'sortDate');
    this.formParam.get('endDate')?.setValue(sortDate);
    this.formParam.get('size')?.setValue('24');

    if (this.formParam.get('endDate')?.value) {
      this.fectDashboardData(this.formParam.value);
      this.initDashboardData(this.formParam.value);
    } else {
      this.formParam.get('endDate')?.setValue('');
      this.fectDashboardData(this.formParam.value);
      this.initDashboardData(this.formParam.value);
    }
  }

  loadMoreData(): void {
    let currentValue = this.formParam.get('size').value || 24; // Nilai awal adalah 24 jika tidak ada
    currentValue = +currentValue + 24; // Konversi ke tipe number dan tambahkan 24

    this.formParam.get('size')?.setValue(currentValue);
    this.fectDashboardData(this.formParam.value);
  }

  // get card data
  fectDashboardData(param?: ImsPaginationDTO): void {
    this.store.dispatch(DashboardAction.onClearAircraftList());

    this.dashboardService
      .getCardData(param)
      .pipe(
        timeout(300000),
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
          if (this.totalLoadedData == this.formParam.get('size')?.value) {
            this.btnPaggination = true;
          } else {
            this.btnPaggination = false;
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
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
        timeout(300000),
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
            this.fetchAircraftRegistrationData(
              aircraft.aircraftRegistration,
              this.sortDateSelected
            );
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  fetchAircraftRegistrationData(
    aircraftRegistration: string,
    sortDate?: string
  ): void {
    this.store.dispatch(DashboardAction.onClearApu());
    this.store.dispatch(DashboardAction.onClearEngineTrend());
    this.store.dispatch(DashboardAction.onClearEngineGe());
    this.store.dispatch(DashboardAction.onClearBleed());
    this.store.dispatch(DashboardAction.onClearRepetitive());
    this.store.dispatch(DashboardAction.onClearPack());

    this.dashboardService
      .getApu(aircraftRegistration, sortDate)
      .pipe(
        timeout(300000),
        catchError((err) => {
          console.error(
            'Error on DashboardComponent get Aircraft Registration => ',
            err
          );
          return EMPTY;
        }),
        tap((result) => {
          if (result !== null) {
            // Pastikan tidak ada error sebelum melanjutkan
            const apuRecord = result.data.record.apuRecord;
            const engineTrendRecord = result.data.record.engineTrendRecord;
            const engineGeRecord = result.data.record.engineGeRecord;
            const bleedRecord = result.data.record.bleedRecord;
            const repetitiveRecord = result.data.record.repetitiveRecord;
            const packRecord = result.data.record.packRecord;
            console.log(result.data.record);

            this.store.dispatch(DashboardAction.onLoadApu({ data: apuRecord }));
            this.store.dispatch(
              DashboardAction.onLoadEngineTrend({ data: engineTrendRecord })
            );
            this.store.dispatch(
              DashboardAction.onLoadEngineGe({ data: engineGeRecord })
            );
            this.store.dispatch(
              DashboardAction.onLoadBleed({ data: bleedRecord })
            );
            this.store.dispatch(
              DashboardAction.onLoadRepetitive({ data: repetitiveRecord })
            );
            this.store.dispatch(
              DashboardAction.onLoadPack({ data: packRecord })
            );
          }
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  // summaryScore, averageHealt, PercentageScore, Difference
  async initDashboardData(param?: ImsPaginationDTO): Promise<void> {
    this.store.dispatch(DashboardAction.onClearSummaryScore());

    this.dashboardService
      .getAhiSummaryScore(param)
      .pipe(
        timeout(300000),
        catchError((error) => {
          console.error(
            'Error on DashboardComponent get summryScore => ',
            error
          );
          return EMPTY;
        }),
        tap((result) => {
          this.initAveragehealth(param);
          this.initPercentageScoreData(param);
          this.initDifference(param);
          this.store.dispatch(DashboardAction.onLoadSummaryScore(result.data));
        }),
        takeUntil(this._onDestroy$)
      )
      .subscribe();
  }

  // Percentage
  async initPercentageScoreData(param?: ImsPaginationDTO): Promise<void> {
    this.store.dispatch(DashboardAction.onClearAveragePercentage());

    this.dashboardService
      .getAveragePersen(param)
      .pipe(
        timeout(300000),
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
  async initAveragehealth(param?: ImsPaginationDTO): Promise<void> {
    this.store.dispatch(DashboardAction.onClearAverageHealth());

    this.dashboardService
      .getAverageHealt(param)
      .pipe(
        timeout(300000),
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
  async initDifference(param?: ImsPaginationDTO): Promise<void> {
    this.store.dispatch(DashboardAction.ocClearDifference());

    this.dashboardService
      .getDifference(param)
      .pipe(
        timeout(300000),
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
