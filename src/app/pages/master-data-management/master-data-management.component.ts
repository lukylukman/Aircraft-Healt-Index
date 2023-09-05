import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import { Observable, Subject, catchError, firstValueFrom, of, takeUntil, tap } from 'rxjs';
import Shepherd from 'shepherd.js';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { LocalStorageServiceInterface } from 'src/app/core/interfaces/localstorage.service.interface';
import { LocalstorageService } from 'src/app/core/services/localstorage.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { TourGuideConst } from 'src/app/shared/const/tour-guide.const';
import Swal from 'sweetalert2';
import { StoreDTO, UnitDTO } from './dto/master-data-manaement.dto';
import { MasterDataManagementService } from './master-data-management.service';
import * as MasterDataManagementAction from './states/master-data-management.action';
import { MasterDataManagementFeatureState } from './states/master-data-management.feature';
import { MasterDataManagementState } from './states/master-data-management.selector';

@Component({
  selector: 'app-master-data-management',
  templateUrl: './master-data-management.component.html',
  styleUrls: ['./master-data-management.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate(
          200,
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          200,
          style({ opacity: 0, transform: 'translateX(-100px)' })
        )
      ])
    ]),
    trigger('fadeSlideTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100px)' }),
        animate(
          300,
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          300,
          style({ opacity: 0, transform: 'translateY(-100px)' })
        )
      ])
    ]),
  ]
})
export class MasterDataManagementComponent
  implements OnInit, AfterViewInit, OnDestroy {
  logger: LoggerService;
  private readonly unsubscribe$ = new Subject();
  masterDataManagementState$: Observable<MasterDataManagementFeatureState>;

  addStoreModal?: Modal;
  editStoreModal?: Modal;
  localservice: LocalStorageServiceInterface;

  unitData: UnitDTO[] = [];

  tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
    }
  });

  formGroup = new FormGroup({
    unit: new FormControl<string>('', Validators.required),
    store: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('', Validators.required),
  });

  constructor(
    private readonly store: Store,
    private readonly masterDataManagementService: MasterDataManagementService,
    private readonly soeService: UserSoeService,
    private route: RouteHelperService
  ) {
    this.localservice = new LocalstorageService();
    this.masterDataManagementState$ = this.store.select(
      MasterDataManagementState
    );
    this.logger = new LoggerService(MasterDataManagementComponent.name);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  /**
   * routing settings
   */
  ngOnInit(): void {
    RouteHelperService.createRouteGroup('Master Management', {
      basePath: this.route.getBasePath(),
      groupIcon: 'database',
      path: 'master-management',
      route: this.route.getLoadedRoutes(),
    });

    this.fetchAllData();

    this.tour.addStep({
      id: 'master-data-management-step-1',
      title: 'Welcome to Master Data Management',
      text: 'in this sub-menu you can manage store and unit relation',
      arrow: true,
      buttons: [
        {
          text: 'SKIP',
          action: this.tour.cancel,
          secondary: true
        },
        {
          text: 'NEXT',
          action: this.tour.next,
        },
      ]
    });
    this.tour.addStep({
      id: 'master-data-management-step-2',
      title: 'Add New Store',
      text: 'you can add new store by clicking the plus icon',
      arrow: true,
      attachTo: {
        element: '.add-store',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'SKIP',
          action: this.tour.cancel,
          secondary: true
        },
        {
          text: 'BACK',
          action: this.tour.back,
          secondary: true
        },
        {
          text: 'NEXT',
          action() {
            this.next();
          },
        },
      ]
    });
    this.tour.addStep({
      id: 'master-data-management-step-3',
      title: 'Edit Store',
      text: 'you can edit store by clicking the pencil icon',
      arrow: true,
      attachTo: {
        element: '.edit-store',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'SKIP',
          action: this.tour.cancel,
          secondary: true
        },
        {
          text: 'BACK',
          action: this.tour.back,
          secondary: true
        },
        {
          text: 'NEXT',
          action() {
            this.next();
          },
        },
      ]
    });
    this.tour.addStep({
      id: 'master-data-management-step-4',
      title: 'Delete Store',
      text: 'you can delete store by clicking the trash icon. remember that you have to make sure the store has no tool or unit related to it, you can delete tools and units of the store first',
      arrow: true,
      attachTo: {
        element: '.delete-store',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'BACK',
          action: this.tour.back,
          secondary: true
        },
        {
          text: 'FINISH TOUR',
          action() {
            this.cancel();
          },
        },
      ]
    });

    this.tour.on('cancel', this.onCancelTour.bind(this))

    if (localStorage.getItem(TourGuideConst.MASTER_DATA_MANAGEMENT)) {
      // this.logger.log('no tour');
    } else {
      this.tour.start();
    }
  }

  onCancelTour() {
    // this.logger.log('cancel tour tool data');
    this.localservice.saveData(
      TourGuideConst.MASTER_DATA_MANAGEMENT,
      JSON.stringify(true)
    );
    // this.logger.log(localStorage.getItem(TourGuideConst.TOOL_DATA));
  }

  onStartTour() {
    this.tour.start();
  }

  /**
   * modals settings
   */
  ngAfterViewInit(): void {
    this.addStoreModal = new Modal(document.getElementById('addStore'), {});
    this.editStoreModal = new Modal(document.getElementById('editStore'), {});
  }

  /**
   * fetch data unit and store
   */
  fetchAllData() {

    this.fetchUnitData();

    // this.fetchStatusData();

    // this.fetchStoreData();
    this.checkStoreData();
  }

  async checkStoreData(): Promise<void> {
    const storeData: MasterDataManagementFeatureState = await firstValueFrom(
      this.masterDataManagementState$
    )
    if (storeData?.stores?.length === 0) {
      this.fetchStoreData()
    }
  }

  /**
   * fetch all unit data
   */
  async fetchUnitData(): Promise<void> {
    this.store.dispatch(MasterDataManagementAction.onClearUnit());
    this.soeService
      .getAllUnit()
      .then((units) => {
        this.logger.log('store unit', units);
        units.forEach((unit, i) => {
          const unitList: UnitDTO = {
            id: i,
            unit: unit.unit,
          };
          // this.unitData.push(unitList) //backup store error
          this.store.dispatch(MasterDataManagementAction.onLoadUnit(unitList));
        });
      })
      .catch((_err) => {
        Swal.fire(
          {
            confirmButtonColor: "#1F569D",
            title: 'Something went wrong',
            html: "Error while fetching all units data",
            // icon: 'error',
          })
      });
  }

  /**
   * fetch all store data
   */
  fetchStoreData(): void {
    this.store.dispatch(MasterDataManagementAction.onClearStore());
    this.masterDataManagementService
      .getAllStore()
      .pipe(
        tap({
          next: (val) => {
            val.forEach((item) =>
              this.store.dispatch(MasterDataManagementAction.onLoadStore(item))
            );
          },
          error: (_err) => {
            Swal.fire(
              {
                title: 'Something went wrong',
                html: "Can't fetch store data",
                confirmButtonColor: "#1F569D",
              })
          },
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  /**
   * show add store modal
   */
  showAddStore() {
    this.addStoreModal?.show();
  }

  /**
   * 
   * @param store show selected edit store modal
   */
  showEditStore(store: StoreDTO) {
    this.logger.log('selected store=>', store)
    this.store.dispatch(MasterDataManagementAction.onSelectStore(store));
    this.editStoreModal?.show();
  }

  /**
   * delete store
   * @param store
   */
  @Confirmable({
    title: 'Remove Store',
    html: `Are you sure to remove store? make sure store is not related to existed tools and units`,
    // icon: 'warning',
    confirmButtonText: 'Yes, remove store',
    denyButtonText: "No, i'm not sure",
  })
  onRemoveStore(store: StoreDTO) {
    this.masterDataManagementService
      .deleteStore(store)
      .pipe(
        tap((_) => {
          console.log('Deleting store success', _);
          this.fetchStoreData();
          Swal.fire(
            {
              confirmButtonColor: "#1F569D",
              title: 'Success',
              html: "store has been deleted",
              icon: 'success',
            })
        }
        ),
        catchError((error) => {
          if (error.status === 400) {
            Swal.fire(
              {
                confirmButtonColor: "#1F569D",
                title: 'Something went wrong',
                html: "The store you want to delete still has data related to it. please check tools or unit data!",
              })
          } else if (error.status === 409) {
            Swal.fire(
              {
                confirmButtonColor: "#1F569D",
                title: 'Error 409',
                html: "The store you want to delete still has data related to it. please check tools or unit data!",
              })
          }
          return of(
            console.log('err => ', error)
          );
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  // fetchStatusData(): void {
  //   this.masterDataManagementService
  //     .getAllStatus()
  //     .pipe(
  //       tap({
  //         next: (val) => {
  //           val.forEach((item) =>
  //             this.store.dispatch(MasterDataManagementAction.onLoadStatus(item))
  //           );
  //         },
  //         error: (err) => {
  //           Swal.fire(
  //             'Something went wrong',
  //             "Can't fetch status data",
  //             'error'
  //           );
  //         },
  //       })
  //     )
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe();
  // }

}
