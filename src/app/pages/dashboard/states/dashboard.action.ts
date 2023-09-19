import { createAction, props } from '@ngrx/store';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { AhiSummaryScoreDTO } from '../dto/ahi-summary-score.dto';
import { AircraftDTO } from '../dto/aircraft.dto';
import { DashboardActionType } from './dashboard.action.type';

export const onDashboardLoaded = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_LOAD,
  props<PaginationResultDTO<AircraftDTO>>()
);

export const onDashboardSelected = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_SELECTED,
  props<AircraftDTO>()
);

export const onDashboardClear = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_CLEAR
);

export const onDashboardLoadedToday = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_LOAD_TODAY,
  props<AircraftDTO>()
);

export const onLoadAircraftList = createAction(
  DashboardActionType.ON_DASHBOARD_LIST_LOAD,
  props<AircraftDTO>()
);

export const onClearAircraftList = createAction(
  DashboardActionType.ON_DASHBOARD_LIST_CLEAR
);

export const onLoadSummaryScore = createAction(
  DashboardActionType.ON_SUMMARY_SCORE_LOAD,
  props<AhiSummaryScoreDTO>()
);
