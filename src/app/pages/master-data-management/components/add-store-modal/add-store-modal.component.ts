import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'flowbite';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { LoggerService } from 'src/app/core/services/logger.service';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import Swal from 'sweetalert2';
import { StoreInsertDTO } from '../../dto/master-data-manaement.dto';
import { MasterDataManagementService } from '../../master-data-management.service';
import * as MasterDataManagementAction from '../../states/master-data-management.action';
import { MasterDataManagementFeatureState } from '../../states/master-data-management.feature';
import { MasterDataManagementState } from '../../states/master-data-management.selector';

@Component({
  selector: 'app-add-store-modal',
  templateUrl: './add-store-modal.component.html',
  styleUrls: ['./add-store-modal.component.css'],
})
export class AddStoreModalComponent implements AfterViewInit, OnDestroy {
  logger: LoggerService;
  isSearch: boolean = false;
  private readonly unsubscribe$ = new Subject();

  //Modal Setting
  addStoreModal?: Modal;

  masterDataManagementState$: Observable<MasterDataManagementFeatureState>;

  formGroup = new FormGroup({
    unit: new FormControl([], [Validators.required]),
    store: new FormControl('', [Validators.maxLength(2), Validators.minLength(2), Validators.required]),
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
    private readonly masterDataManagementService: MasterDataManagementService
  ) {
    this.logger = new LoggerService(AddStoreModalComponent.name);

    this.masterDataManagementState$ = this.store.select(
      MasterDataManagementState
    );
  }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  resetForm() { }

  ngAfterViewInit(): void {
    this.addStoreModal = new Modal(document.getElementById('addStore'), {});
  }

  onItemSelect(item: any) {
    this.logger.log(item);
  }

  @Confirmable({
    title: 'Are you sure?',
    html: 'You will add store, Continue?',
    // icon: 'warning',
    confirmButtonText: 'Yes, add store',
    denyButtonText: "No, i'm not sure",
  })
  onSubmit() {
    const listUnit: string[] = this.formGroup.controls.unit.value.map(
      (f) => f.unit
    );

    const insertStore: StoreInsertDTO = {
      store: this.formGroup.controls.store.value,
      address: this.formGroup.controls.address.value,
      unit: listUnit,
    };

    this.masterDataManagementService
      .insertStore(insertStore)
      .pipe(
        tap({
          next: (_) => {
            this.logger.log('store added', _);
            this.fetchStoreData();
            Swal.fire(
              {
                title: 'Success',
                html: "Store Has Been Added Successfully",
                icon: 'success',
                confirmButtonColor: "#1F569D",
              })
          },
          error: (err) => {
            Swal.fire(
              {
                title: 'Something went wrong',
                html: "Can't Add new Store",
                confirmButtonColor: "#1F569D",
              })
          },
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();

    this.addStoreModal?.hide();
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
}
