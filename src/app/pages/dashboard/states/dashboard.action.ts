import { createAction, props } from '@ngrx/store';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { AircraftDTO } from '../dto/aircraft.dto';
import { DashboardActionType } from './dashboard.action.type';

export const onDashboardLoaded = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_LOAD,
  props<PaginationResultDTO<AircraftDTO>>(),
);

export const onDashboardSelected = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_SELECTED,
  props<AircraftDTO>(),
);

export const onDashboardClear = createAction(DashboardActionType.ON_DASHBOARD_DATA_CLEAR);

export const onDashboardLoadedToday = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_LOAD_TODAY,
  props<AircraftDTO>(),
);
