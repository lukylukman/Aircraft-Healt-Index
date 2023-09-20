import { createAction, props } from '@ngrx/store';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { AhiSummaryScoreDTO } from '../dto/ahi-summary-score.dto';
import { AircraftTypeDTO } from '../dto/aircraft-type.dto';
import { AircraftDTO } from '../dto/aircraft.dto';
import { DashboardActionType } from './dashboard.action.type';
import { AircraftDetailHilDTO } from '../dto/aircraft-detail-hil.dto';

export const onDashboardLoaded = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_LOAD,
  props<PaginationResultDTO<AircraftDTO>>()
);

export const onDashboardSelected = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_SELECTED,
  props<AircraftDTO>()
);

export const onDashboardClearSelected = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_SELECTED_CLEAR
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

// Aircraft Type

export const onClearAircraftType = createAction(
  DashboardActionType.ON_AIRCRAFT_TYPE_CLEAR
);

export const onLoadAircraftType = createAction(
  DashboardActionType.ON_AIRCRAFT_TYPE_LOAD,
  props<AircraftTypeDTO>()
);

// Aircraft Detail Hil
export const onClearAircraftDetailHil = createAction(
  DashboardActionType.ON_AIRCRAFT_DETAIL_HIL_CLEAR
);

export const onLoadAircraftDetailHil = createAction(
  DashboardActionType.ON_AIRCRAFT_DETAIL_HIL_LOAD,
  props<AircraftDetailHilDTO>()
);
