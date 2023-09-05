import { createAction, props } from '@ngrx/store';
import { StoreDTO, UnitDTO } from '../dto/master-data-manaement.dto';
import { MasterDataManagementActionType } from './master-data-management.action.type';

export const onLoadUnit = createAction(
  MasterDataManagementActionType.ON_LOAD_UNIT,
  props<UnitDTO>()
);

export const onLoadStore = createAction(
  MasterDataManagementActionType.ON_LOAD_STORE,
  props<StoreDTO>()
);

// export const onLoadStatus = createAction(
//   MasterDataManagementActionType.ON_LOAD_STATUS,
//   props<StatusDTO>()
// );

export const onSelectUnit = createAction(
  MasterDataManagementActionType.ON_SELECT_UNIT,
  props<UnitDTO>()
);

export const onSelectStore = createAction(
  MasterDataManagementActionType.ON_SELECT_STORE,
  props<StoreDTO>()
);

// export const onSelectStatus = createAction(
//   MasterDataManagementActionType.ON_SELECT_STATUS,
//   props<StatusDTO>()
// );

export const onClearStore = createAction(
  MasterDataManagementActionType.ON_CLEAR_STORE
);

// export const onClearStatus = createAction(
//   MasterDataManagementActionType.ON_CLEAR_STATUS
// );

export const onClearUnit = createAction(
  MasterDataManagementActionType.ON_CLEAR_UNIT
);
