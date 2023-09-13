import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, debounceTime, takeUntil } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { DashboardService } from './dashboard.service';
import { Modal } from 'flowbite';

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
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

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

  personalInformation: PersonalInformation;
  storeOption: SelectionDTO[] = [];

  version: string = environment.version;
  selectedSearchSelection: string = '';
  isModalOpen: boolean = false;
  selectedCardData: any;

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
    this.dashboardService.getCardData().subscribe((data) => {
      this.cardData = data;
      console.log('DataAircraftCard =>', this.cardData);
    })
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

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  cardData: AircraftDTO[] = [];
}
