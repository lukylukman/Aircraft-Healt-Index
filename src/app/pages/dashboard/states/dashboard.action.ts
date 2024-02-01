import { createAction, props } from '@ngrx/store';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { AhiSummaryScoreDTO } from '../dto/ahi-summary-score.dto';
import { AircraftDetailHilDTO } from '../dto/aircraft-detail-hil.dto';
import { AircraftTypeDTO } from '../dto/aircraft-type.dto';
import { AircraftDTO, AircraftDTO2 } from '../dto/aircraft.dto';
import { AverageHealt } from '../dto/average-healt.dto';
import {
  APURecordDTO,
  BleedRecordDTO,
  EngineGeRecordDTO,
  EngineTrendRecordDTO,
  HilRecordDTO,
  PackRecordDTO,
  RepetitiveRecordDTO,
} from '../dto/showMoreHil.dto';
import { DashboardActionType } from './dashboard.action.type';
import { SetConfigDTO } from '../dto/setConfig.dto';
import { AsdcsRecordDTO } from '../dto/asdcs.dto';
import { CmlRecordDTO } from '../dto/cml.dto';

export const onDashboardLoaded = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_LOAD,
  props<PaginationResultDTO<AircraftDTO>>()
);

export const onDashboardSelected = createAction(
  DashboardActionType.ON_DASHBOARD_DATA_SELECTED,
  props<AircraftDTO2>()
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
  props<AircraftDTO2>()
);

export const onClearAircraftList = createAction(
  DashboardActionType.ON_DASHBOARD_LIST_CLEAR
);

export const onClearSummaryScore = createAction(
  DashboardActionType.ON_SUMMARY_SCORE_CLEAR
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
  props<{ data: AircraftDetailHilDTO[] }>()
);
// Average Health
export const onClearAverageHealth = createAction(
  DashboardActionType.ON_AIRCRAFT_AVERAGE_HEALTH_CLEAR
);

export const onLoadAverageHealth = createAction(
  DashboardActionType.ON_AIRCRAFT_AVERAGE_HEALTH_LOAD,
  props<AverageHealt>()
);

// Average Percentage
export const onClearAveragePercentage = createAction(
  DashboardActionType.ON_AIRCRAFT_PERCENTAGE_HEALTH_CLEAR
);

export const onLoadAveragePercentage = createAction(
  DashboardActionType.ON_AIRCRAFT_PERCENTAGE_HEALTH_LOAD,
  props<AverageHealt>()
);

// Difference
export const ocClearDifference = createAction(
  DashboardActionType.ON_AIRCRAFT_DIFFERENCE_CLEAR
);

export const onLoadDifference = createAction(
  DashboardActionType.ON_AIRCRAFT_DIFFERENCE_LOAD,
  props<AverageHealt>()
);

// APU
export const onClearApu = createAction(DashboardActionType.ON_APU_CLEAR);

export const onLoadApu = createAction(
  DashboardActionType.ON_APU_LOAD,
  props<{ data: APURecordDTO[] }>()
);

// Engine Trend
export const onClearEngineTrend = createAction(
  DashboardActionType.ON_ENGINE_TREND_CLEAR
);

export const onLoadEngineTrend = createAction(
  DashboardActionType.ON_ENGINE_TREND_LOAD,
  props<{ data: EngineTrendRecordDTO[] }>()
);

// Engine Ge
export const onClearEngineGe = createAction(
  DashboardActionType.ON_ENGINE_GE_CLEAR
);

export const onLoadEngineGe = createAction(
  DashboardActionType.ON_ENGINE_GE_LOAD,
  props<{ data: EngineGeRecordDTO[] }>()
);

// Repetitive
export const onClearRepetitive = createAction(
  DashboardActionType.ON_REPETITIVE_CLEAR
);

export const onLoadRepetitive = createAction(
  DashboardActionType.ON_REPETITIVE_LOAD,
  props<{ data: RepetitiveRecordDTO[] }>()
);

// Bleed
export const onClearBleed = createAction(DashboardActionType.ON_BLEED_CLEAR);

export const onLoadBleed = createAction(
  DashboardActionType.ON_BLEED_LOAD,
  props<{ data: BleedRecordDTO[] }>()
);

// Asdcs
export const onClearAsdcs = createAction(DashboardActionType.ON_ASDCS_CLEAR);
export const onLoadAsdcs = createAction(
  DashboardActionType.ON_ASDCS_LOAD,
  props<{ data: AsdcsRecordDTO[] }>()
);

// Cml
export const onClearCml = createAction(DashboardActionType.ON_CML_CLEAR);
export const onLoadCml = createAction(
  DashboardActionType.ON_CML_LOAD,
  props<{ data: CmlRecordDTO[] }>()
);

// Pack
export const onClearPack = createAction(DashboardActionType.ON_PACK_CLEAR);

export const onLoadPack = createAction(
  DashboardActionType.ON_PACK_LOAD,
  props<{ data: PackRecordDTO[] }>()
);

// Hil
export const onClearHil = createAction(DashboardActionType.ON_HIL_CLEAR);

export const onLoadHil = createAction(
  DashboardActionType.ON_HIL_LOAD,
  props<{ data: HilRecordDTO[] }>()
);

// Setting Config

export const onClearConfigData = createAction(
  DashboardActionType.ON_CONFIG_DATA_CLEAR
);

export const OnLoadConfigData = createAction(
  DashboardActionType.ON_CONFIG_DATA_LOAD,
  props<SetConfigDTO>()
);

// Clear all state
export const resetDashboardState = createAction('[Dashboard] Reset State');
