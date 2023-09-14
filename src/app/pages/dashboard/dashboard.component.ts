import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  map,
  of,
  takeUntil,
  tap,
} from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { DashboardService } from './dashboard.service';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import Shepherd from 'shepherd.js';
import { LocalStorageServiceInterface } from 'src/app/core/interfaces/localstorage.service.interface';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { PersonalInformation } from 'src/app/shared/layout/sidebar/interfaces/sidebar.interface';
import { SidebarService } from 'src/app/shared/layout/sidebar/sidebar.service';
import { SelectionDTO } from 'src/app/shared/reuseable-ui-components/dropdown/interface/selection.dto';
import { environment } from 'src/environments/environment';
import { MasterDataManagementService } from '../master-data-management/master-data-management.service';
import { MasterDataManagementFeatureState } from '../master-data-management/states/master-data-management.feature';
import { MasterDataManagementState } from '../master-data-management/states/master-data-management.selector';
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
  localservice: LocalStorageServiceInterface;
  isSearch: boolean = false;
  isAdvance: boolean = false;
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

  showModal: boolean = false;
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
    },
  });

  dashboardState$: Observable<DashboardFeatureState>;
  personalInformation: PersonalInformation;
  storeOption: SelectionDTO[] = [];

  version: string = environment.version;
  selectedSearchSelection: string = '';
  isModalOpen: boolean = false;
  selectedCardData: any;

  paginationData: ImsPaginationDTO = {
    page: 1,
    size: 24,
  };

  masterDataManagementState$: Observable<MasterDataManagementFeatureState>;

  constructor(
    private route: RouteHelperService, // private readonly unsubscribe$ = new Subject()
    private readonly dashboardService: DashboardService,
    private readonly soeService: UserSoeService,
    private readonly store: Store,
    private readonly masterDataManagementService: MasterDataManagementService,
    private _sidebar: SidebarService // public readonly tourService: TourService,
  ) {
    this.masterDataManagementState$ = this.store.select(
      MasterDataManagementState
    );
    this.localservice = new LocalstorageService();
    this.logger = new LoggerService(DashboardComponent.name);
    this.dashboardState$ = this.store.select(DashboardState);
    this.personalInformation =
      this.soeService.getPersonalInformationFromCache();

    this.formGroup.valueChanges
      .pipe(debounceTime(650))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        console.log('form =>', val);
      });
  }

  partNumber: string = '';

  formGroup = new FormGroup({
    partNumber: new FormControl<string>('', [Validators.required]),
    searchCategory: new FormControl('ahi-master-*'),
  });

  ngOnInit(): void {
    this.fectDashboardData();
  }

  ngAfterViewInit(): void {
    const modal = new Modal(document.getElementById('modalDetailCard'), {});
    const modalToggleButton = document.getElementById('modalDetailCardBtn');
    if (modalToggleButton) {
      modalToggleButton.addEventListener('click', () => {
        this.isModalOpen = !this.isModalOpen;
        modal.toggle();
      });
    }

    const closeModalButton = document.querySelector(
      '[data-modal-toggle="closeModalDetailCard"]'
    );
    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        this.isModalOpen = false;
        modal.toggle();
      });
    }
  }

  fectDashboardData(): void {
    this.dashboardService
      .getCardData(this.paginationData)
      .pipe(
        tap((res) => {
          res.data.forEach((el) => {
            this.dashboardService
              .getAircraftScore(el.aircraftRegistration)

              .pipe(
                map((score) => {
                  // Perform your transformation here
                  let tempAircraft: AircraftDTO = {
                    sapRegistration: el.sapRegistration,
                    aircraftRegistration: el.aircraftRegistration,
                    carrierId: el.carrierId,
                    blockOnDate: el.blockOnDate,
                    blockOnTime: el.blockOnTime,
                    arrivalStation: el.arrivalStation,
                    aircraftScore: score.data,
                  };

                  return tempAircraft;
                }),
                catchError((error) => {
                  // Handle the error here
                  console.error('An error occurred:', error);

                  // Map the error to a different value and return it
                  return of({
                    sapRegistration: el.sapRegistration,
                    aircraftRegistration: el.aircraftRegistration,
                    carrierId: el.carrierId,
                    blockOnDate: el.blockOnDate,
                    blockOnTime: el.blockOnTime,
                    arrivalStation: el.arrivalStation,
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
            console.log('all cards data => ', this.cardData);
          });
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(); // Don't forget to subscribe to trigger the observable
  }

  selectedCard: any;

  openCardDetail(card: any) {
    this.selectedCard = card;
    this.isModalOpen = true; // Open the modal
    const modal = new Modal(document.getElementById('modalDetailCard'), {});
    modal.toggle();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
