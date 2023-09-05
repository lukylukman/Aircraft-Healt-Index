import { createFeature, createReducer, on } from '@ngrx/store';
import { SelectionDTO } from 'src/app/shared/reuseable-ui-components/dropdown/interface/selection.dto';
import { StoreDTO, UnitDTO } from '../dto/master-data-manaement.dto';
import * as MasterDataManagementAction from './master-data-management.action';

export interface MasterDataManagementFeatureState {
  units: UnitDTO[];
  // status: StatusDTO[];
  stores: StoreDTO[];
  selectedUnit: UnitDTO;
  storeListSelection: SelectionDTO[];
  selectedUnits: UnitDTO;
  // selectedStatus: StatusDTO;
  selectedStore: StoreDTO;
}
const initialState: MasterDataManagementFeatureState = {
  units: [],
  // status: [],
  stores: [],
  selectedUnit: undefined,
  storeListSelection: [],
  selectedUnits: undefined,
  // selectedStatus: undefined,
  selectedStore: undefined,
};

export const MasterDataManagementFeature = createFeature({
  name: 'MasterDataManagementFeature',
  reducer: createReducer(
    initialState,
    // on(
    //   MasterDataManagementAction.onSelectStatus,
    //   (state: MasterDataManagementFeatureState, data: StatusDTO) => ({
    //     ...state,
    //     selectedStatus: data,
    //   })
    // ),

    on(
      MasterDataManagementAction.onSelectStore,
      (state: MasterDataManagementFeatureState, data: StoreDTO) => ({
        ...state,
        selectedStore: data,
      })
    ),

    on(
      MasterDataManagementAction.onClearStore,
      (state: MasterDataManagementFeatureState) => ({
        ...state,
        stores: [],
        storeListSelection: [],
      })
    ),

    // on(
    //   MasterDataManagementAction.onClearStatus,
    //   (state: MasterDataManagementFeatureState) => ({
    //     ...state,
    //     status: [],
    //   })
    // ),

    on(
      MasterDataManagementAction.onClearUnit,
      (state: MasterDataManagementFeatureState) => ({
        ...state,
        units: [],
      })
    ),

    on(
      MasterDataManagementAction.onSelectUnit,
      (state: MasterDataManagementFeatureState, data: UnitDTO) => ({
        ...state,
        selectedUnit: data,
      })
    ),

    // on(
    //   MasterDataManagementAction.onLoadStatus,
    //   (state: MasterDataManagementFeatureState, data: StatusDTO) => ({
    //     ...state,
    //     status: [...state.status, data],
    //   })
    // ),

    on(
      MasterDataManagementAction.onLoadStore,
      (state: MasterDataManagementFeatureState, data: StoreDTO) => ({
        ...state,
        stores: [...state.stores, data],
        storeListSelection: [
          ...state.storeListSelection,
          {
            id: data.idStore,
            name: data.store,
            value: data.idStore,
          },
        ],
      })
    ),

    on(
      MasterDataManagementAction.onLoadUnit,
      (state: MasterDataManagementFeatureState, data: UnitDTO) => ({
        ...state,
        units: [...state.units, data],
      })
    )
  ),
});
