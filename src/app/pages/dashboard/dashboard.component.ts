import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import { EMPTY, Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
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
import { AircraftDTO } from './dto/aircraft.dto';
import { ImsPaginationDTO } from './dto/ims-pagination.dto';
import * as DashboardAction from './states/dashboard.action';
import { DashboardFeatureState } from './states/dashboard.feature';
import { DashboardState } from './states/dashboard.selector';

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

  cardData: AircraftDTO[] = [];
  logger: LoggerService;
  isSearch: boolean = false;
  isAdvance: boolean = false;
  selectedCard: AircraftDetailHilDTO;
  sortDateSelected: string = '';
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
    this.fectDashboardData(aircraftId);
  }

  onInputSortDate(sortDate: string): void {
    const sortDateValue = String(sortDate);
    this.fectDashboardData(undefined, sortDate);
    this.sortDateSelected = sortDate;
  }

  ngOnInit(): void {
    this.fectDashboardData();
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

  fectDashboardData(aircraftTypeId?: number, sortDate?: string): void {
    this.store.dispatch(DashboardAction.onClearAircraftList());

    this.dashboardService
      .getCardData(this.paginationData, aircraftTypeId)
      .pipe(
        tap((res) => {
          res.data.forEach((el) => {
            this.dashboardService
              .getAircraftScore(el.aircraftRegistration, sortDate)

              .pipe(
                map((score) => {
                  // console.log('Score Data => ', score);

                  // Perform your transformation here
                  let tempAircraft: AircraftDTO = {
                    aircraftGroup: el.aircraftGroup,
                    sapRegistration: el.sapRegistration,
                    aircraftRegistration: el.aircraftRegistration,
                    carrierId: el.carrierId,
                    blockOnDate: el.blockOnDate,
                    blockOnTime: el.blockOnTime,
                    arrivalStation: el.arrivalStation,
                    aircraftType: el.aircraftType,
                    aircraftScore: score.data,
                  };

                  return tempAircraft;
                }),
                catchError((error) => {
                  // Handle the error here
                  console.error('An error occurred:', error);

                  // Map the error to a different value and return it
                  return of({
                    aircraftGroup: el.aircraftGroup,
                    sapRegistration: el.sapRegistration,
                    aircraftRegistration: el.aircraftRegistration,
                    carrierId: el.carrierId,
                    blockOnDate: el.blockOnDate,
                    blockOnTime: el.blockOnTime,
                    arrivalStation: el.arrivalStation,
                    aircraftType: el.aircraftType,
                    aircraftScore: null,
                  });
                })
              )
              .pipe(
                tap((_) => {
                  this.cardData.push(_);
                  this.store.dispatch(DashboardAction.onLoadAircraftList(_));
                })
              )
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe();
            // console.log('all cards data => ', this.cardData);
          });
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(); // Don't forget to subscribe to trigger the observable
  }

  onClickDetailAircraft(): void {
    this.aircraftDetailModal.show();
  }

  onClickHidetailAircraftDetailModal() {
    this.aircraftDetailModal.hide();
  }

  openCardDetail(aircraft: AircraftDTO): void {
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

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
    this.store.dispatch(DashboardAction.resetDashboardState());
  }

}
