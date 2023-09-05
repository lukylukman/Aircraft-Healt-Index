import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { LoggerService } from 'src/app/core/services/logger.service';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { UserSoeService } from 'src/app/core/services/user.soe.service';
import { SelectionDTO } from 'src/app/shared/reuseable-ui-components/dropdown/interface/selection.dto';
import Swal from 'sweetalert2';
import { StoreDTO, StoreInsertDTO } from '../../dto/master-data-manaement.dto';
import { MasterDataManagementService } from '../../master-data-management.service';
import * as MasterDataManagementAction from '../../states/master-data-management.action';
import { MasterDataManagementFeatureState } from '../../states/master-data-management.feature';
import { MasterDataManagementState } from '../../states/master-data-management.selector';

@Component({
  selector: 'app-edit-store-modal',
  templateUrl: './edit-store-modal.component.html',
  styleUrls: ['./edit-store-modal.component.css'],
})
export class EditStoreModalComponent
  implements OnChanges, AfterViewInit, OnInit, OnDestroy {
  @Input() storeData: StoreDTO = {} as StoreDTO;

  logger: LoggerService;
  isSearch: boolean = false;
  private readonly unsubscribe$ = new Subject();

  //Modal Setting
  editStoreModal?: Modal;

  masterDataManagementState$: Observable<MasterDataManagementFeatureState>;

  unitList: SelectionDTO[] = [];

  formGroup = new FormGroup({
    unit: new FormControl([], [Validators.required]),
    store: new FormControl('', [Validators.required, Validators.maxLength(2), Validators.minLength(1)]),
    address: new FormControl('', [Validators.required]),
  });

  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Multi Select
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {
    ...{
      allowSearchFilter: true,
      textField: 'unit',
      itemsShowLimit: 10,
      limitSelection: 10,
    },
  };
  // End of Multiselect

  constructor(
    private route: RouteHelperService,
    private readonly store: Store,
    private readonly soeService: UserSoeService,
    private readonly masterDataManagementService: MasterDataManagementService
  ) {
    this.logger = new LoggerService(EditStoreModalComponent.name);

    this.masterDataManagementState$ = this.store.select(
      MasterDataManagementState
    );
  }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  ngOnInit() { }

  getUnitData() { }

  resetForm() { }

  ngAfterViewInit(): void {
    this.editStoreModal = new Modal(document.getElementById('editStore'), {});
  }

  onItemSelect(item: any) { }

  @Confirmable({
    title: 'Are you sure?',
    html: 'You will change the store data, Continue?',
    // icon: 'warning',
    confirmButtonText: 'Yes, change data',
    denyButtonText: "No, i'm not sure",
  })
  onSubmit(store: StoreDTO) {
    const listUnit: string[] = this.formGroup.controls.unit.value.map(
      (f) => f.unit
    );

    const insertStore: StoreInsertDTO = {
      idStore: store.idStore,
      store: this.formGroup.controls.store.value,
      address: this.formGroup.controls.address.value,
      unit: listUnit,
    };

    this.masterDataManagementService
      .updateStore(insertStore)
      .pipe(
        tap({
          next: (_) => {
            this.logger.log('store updated', _);
            this.fetchStoreData();
            Swal.fire(
              {
                title: 'Success',
                html: "Store Updated Successfully",
                icon: 'success',
                confirmButtonColor: "#1F569D",
              })
          },
          error: (err) => {
            Swal.fire(
              {
                title: 'Something went wrong',
                html: "Can't udate store",
                confirmButtonColor: "#1F569D",
              })
          },
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();

    this.editStoreModal?.hide();
  }

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
          error: (err) => {
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

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['storeData'] &&
      changes['storeData']?.previousValue != changes['storeData']?.currentValue
    ) {
      // this.logger.log('selected store change =>', this.storeData);
      this.formGroup.controls.store.patchValue(this.storeData.store);
      this.formGroup.controls.address.patchValue(this.storeData.address);

      this.formGroup.controls.unit.patchValue([]);
    }
  }
}
