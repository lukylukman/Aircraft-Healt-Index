import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  debounceTime,
  takeUntil
} from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { DashboardService } from './dashboard.service';

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

export interface SearchSelection {
  key: string;
  value: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject();

  logger: LoggerService;
  localservice: LocalStorageServiceInterface;
  isSearch: boolean = false;
  isAdvance: boolean = false;
  searchSelections: SearchSelection[] = [
    {
      // TODO: Please enable later. Disabled due to data is not ready yet!
      key: 'tms-master-tool-data',
      // key: 'tms-master-*',
      value: 'All',
    },
    {
      key: 'tms-master-tool-data',
      value: 'Hangar Tools',
    },
    // {
    //   key: 'tms-master-imte',
    //   value: 'IMTE Tools',
    // },
    // {
    //   key: 'tms-master-tz-equipment',
    //   value: 'TZ Equipment',
    // },
  ];

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
    searchCategory: new FormControl('tms-master-*'),
  });

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
