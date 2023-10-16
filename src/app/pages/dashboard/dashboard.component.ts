import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import { EMPTY, Observable, Subject, catchError, mergeMap, takeUntil, tap } from 'rxjs';
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
  selectedTypeId: number;
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
    private readonly store: Store
  ) {
    this.logger = new LoggerService(DashboardComponent.name);
    this.dashboardState$ = this.store.select(DashboardState);
    this.personalInformation =
      this.soeService.getPersonalInformationFromCache();
  }
  ngAfterViewInit(): void {
    this.aircraftDetailModal = new Modal(document.getElementById('DetailHil'), {});
  }

  formGroup = new FormGroup({
    partNumber: new FormControl<string>('', [Validators.required]),
    searchCategory: new FormControl('ahi-master-*'),
  });

  onAircraftTypeChanged(aircraftTypeId: number): void {
    const aircraftId = Number(aircraftTypeId);
    this.selectedTypeId = aircraftId;
    this.fectDashboardData2(this.selectedTypeId, this.sortDateSelected, this.selectedCustomer);
  }

  onInputSortDate(sortDate: string): void {
    this.sortDateSelected = sortDate;
    this.selectedCustomer = "GA";
    this.fectDashboardData2(this.selectedTypeId, this.sortDateSelected, this.selectedCustomer);
    this.initDashboardData(this.sortDateSelected);
  }

  ngOnInit(): void {
    this.fectDashboardData2();
    this.fetchAircraftType();
  }

  fetchAircraftType(): void {
    this.dashboardService
      .getAircraftType()
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        }),
        tap((result) => {
          if (result !== null) {
            result.data.forEach((acType) => {
              this.store.dispatch(DashboardAction.onLoadAircraftType(acType));
            });
          }
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

  fectDashboardData2(aircraftTypeId?: number, sortDate?: string, customer?: string): void {
    this.store.dispatch(DashboardAction.onClearAircraftList());

    this.dashboardService
      .getCardData(this.paginationData, sortDate, customer, aircraftTypeId)
      .pipe(
        mergeMap((res) => {
          return res.data;
        }),
        tap((tempAircraft) => {
          this.cardData.push(tempAircraft);
          this.store.dispatch(DashboardAction.onLoadAircraftList(tempAircraft));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

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
            this.fetchApuData(aircraft.aircraftRegistration, this.sortDateSelected);
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
          if (result !== null) { // Pastikan tidak ada error sebelum melanjutkan
            const apuRecord = result.data.record.apuRecord;
            // console.log('Data APU => ', result.data.record.apuRecord);
            this.store.dispatch(
              DashboardAction.onLoadApu({ data: apuRecord })
            );
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  // summaryScore, averageHealt, PercentageScore, Difference
  initDashboardData(sortDate?: string): void {
    this.store.dispatch(DashboardAction.onClearSummaryScore());
    
    this.dashboardService
      .getAhiSummaryScore(sortDate)
      .pipe(
        tap({
          next: (_) => {
            this.initAveragehealth(sortDate);
            this.initPercentageScoreData(sortDate);
            this.initDifference(sortDate);
            this.store.dispatch(DashboardAction.onLoadSummaryScore(_.data));
          },
          error: (err) => console.error('Error on HomeComponent => ', err),
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  initPercentageScoreData( sortDate?: string ): void {
    this.store.dispatch(DashboardAction.onClearAveragePercentage());

    this.dashboardService
      .getAveragePersen(sortDate)
      .pipe(
        tap({
          next: (_) => {
            // console.log('Percentage Data => ', _.data);
            const temp: AverageHealt = {
              data: _.data,
            };
            this.store.dispatch(DashboardAction.onLoadAveragePercentage(temp));
          },
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  // average Healtht
  initAveragehealth( sortDate?: string ): void {
    this.store.dispatch(DashboardAction.onClearAverageHealth());

    this.dashboardService
      .getAverageHealt(sortDate)
      .pipe(
        tap({
          next: (_) => {
            const temp: AverageHealt = {
              data: _.data,
            };
            // console.log('temp => ', temp.data);
            this.store.dispatch(DashboardAction.onLoadAverageHealth(temp));
          },
          error: (err) => console.error('Error on HomeComponent => ', err),
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  // Difference value
  initDifference( sortDate: string ): void {
    this.store.dispatch(DashboardAction.ocClearDifference());

    this.dashboardService
      .getDifference(sortDate)
      .pipe(
        tap({
          next: (_) => {
            const temp: AverageHealt = {
              data: _.data,
            };
            // console.log('temp => ', temp.data);
            this.store.dispatch(DashboardAction.onLoadDifference(temp));
          },
          error: (err) => console.error('Error on HomeComponent => ', err),
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
    this.store.dispatch(DashboardAction.resetDashboardState());
  }

}
