import { createFeature, createReducer, on } from '@ngrx/store';
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
import * as DashboardAction from './dashboard.action';
import { ElasticRecordResponse } from '../dashboard.service';
import { SetConfigDTO } from '../dto/setConfig.dto';
import { AsdcsRecordDTO } from '../dto/asdcs.dto';
import { CmlRecordDTO } from '../dto/cml.dto';

const empetyStateDashboard: PaginationResultDTO<AircraftDTO> = {
  data: [],
  currentPage: 0,
  totalItems: 0,
  totalItemsPerPage: 0,
  lastPage: 0,
  hasNext: false,
  hasPrev: false,
};

export interface DashboardFeatureState {
  dashboard: PaginationResultDTO<AircraftDTO>;
  aircraftLists: AircraftDTO2[];
  selectedDashboard: AircraftDTO2;
  ahiSummaryScore: AhiSummaryScoreDTO;
  aircraftType: AircraftTypeDTO[];

  apu: APURecordDTO[];
  engineTrend: EngineTrendRecordDTO[];
  engineGe: EngineGeRecordDTO[];
  bleed: BleedRecordDTO[];
  repetitive: RepetitiveRecordDTO[];
  pack: PackRecordDTO[];
  hil: HilRecordDTO[];
  asdcs: AsdcsRecordDTO[];
  cml: CmlRecordDTO[];

  averageHealt: AverageHealt;

  //hil
  aircraftDetailHil: AircraftDetailHilDTO[];
  configData: SetConfigDTO[];
}

const initialState: DashboardFeatureState = {
  dashboard: empetyStateDashboard,
  selectedDashboard: null,
  aircraftLists: [],
  ahiSummaryScore: {
    amountOfGreenItems: 0,
    amountOfYellowItems: 0,
    amountOfRedItems: 0,
    health: 0,
    percentage: 0,
    decimal: 0,
    difference: 0,
  },
  aircraftType: [],
  aircraftDetailHil: [],
  apu: [],
  averageHealt: undefined,
  configData: [],
  engineTrend: [],
  engineGe: [],
  bleed: [],
  repetitive: [],
  pack: [],
  hil: [],
  asdcs: [],
  cml: [],
};

export const DashboardFeature = createFeature({
  name: 'DashboardFeature',
  reducer: createReducer(
    initialState,
    on(
      DashboardAction.onDashboardLoaded,
      (
        state: DashboardFeatureState,
        data: PaginationResultDTO<AircraftDTO>
      ) => ({
        ...state,
        Dashboard: data,
      })
    ),

    on(
      DashboardAction.onDashboardSelected,
      (state: DashboardFeatureState, data: AircraftDTO2) => ({
        ...state,
        selectedDashboard: data,
      })
    ),
    on(
      DashboardAction.onLoadAircraftList,
      (state: DashboardFeatureState, data: AircraftDTO2) => ({
        ...state,
        aircraftLists: [...state.aircraftLists, data],
      })
    ),
    on(DashboardAction.onClearAircraftList, (state: DashboardFeatureState) => ({
      ...state,
      aircraftLists: [],
    })),

    on(
      DashboardAction.onDashboardClearSelected,
      (state: DashboardFeatureState) => ({
        ...state,
        dashboardData: [],
      })
    ),

    on(DashboardAction.onClearSummaryScore, (state: DashboardFeatureState) => ({
      ...state,
      AhiSummaryScoreDTO: [],
    })),

    on(
      DashboardAction.onLoadSummaryScore,
      (state: DashboardFeatureState, data: AhiSummaryScoreDTO) => ({
        ...state,
        ahiSummaryScore: data,
      })
    ),

    // AIrcraft Type

    on(DashboardAction.onClearAircraftType, (state: DashboardFeatureState) => ({
      ...state,
      aircraftType: [],
    })),

    on(
      DashboardAction.onLoadAircraftType,
      (state: DashboardFeatureState, data: AircraftTypeDTO) => ({
        ...state,
        aircraftType: [...state.aircraftType, data],
      })
    ),

    // Aircraft Detail Hil

    on(
      DashboardAction.onClearAircraftDetailHil,
      (state: DashboardFeatureState) => ({
        ...state,
        aircraftDetailHil: [],
      })
    ),

    on(
      DashboardAction.onLoadAircraftDetailHil,
      (state: DashboardFeatureState, { data }) => ({
        ...state,
        aircraftDetailHil: data,
      })
    ),
    // Aircraft Show More Detail Hil

    on(
      DashboardAction.onLoadAverageHealth,
      (state: DashboardFeatureState, data: AverageHealt) => ({
        ...state,
        ahiSummaryScore: {
          ...state.ahiSummaryScore, // Spread the original object
          health: Math.floor(data.data), // Override the percentage property
          decimal: Math.round((data.data - Math.floor(data.data)) * 100),
        },
      })
    ),
    on(
      DashboardAction.onLoadAveragePercentage,
      (state: DashboardFeatureState, data: AverageHealt) => ({
        ...state,
        ahiSummaryScore: {
          ...state.ahiSummaryScore, // Spread the original object
          percentage: data.data, // Override the percentage property
        },
      })
    ),
    on(
      DashboardAction.onLoadDifference,
      (state: DashboardFeatureState, data: AverageHealt) => ({
        ...state,
        ahiSummaryScore: {
          ...state.ahiSummaryScore, // Spread the original object
          difference: data.data, // Override the percentage property
        },
      })
    ),

    // APU
    on(DashboardAction.onClearApu, (state: DashboardFeatureState) => ({
      ...state,
      apu: [],
    })),
    on(DashboardAction.onLoadApu, (state: DashboardFeatureState, { data }) => ({
      ...state,
      apu: data,
    })),

    // Engine Trend
    on(DashboardAction.onClearEngineTrend, (state: DashboardFeatureState) => ({
      ...state,
      engineTrend: [],
    })),
    on(
      DashboardAction.onLoadEngineTrend,
      (state: DashboardFeatureState, { data }) => ({
        ...state,
        engineTrend: data,
      })
    ),

    // Engine Ge
    on(DashboardAction.onClearEngineGe, (state: DashboardFeatureState) => ({
      ...state,
      engineGe: [],
    })),
    on(
      DashboardAction.onLoadEngineGe,
      (state: DashboardFeatureState, { data }) => ({
        ...state,
        engineGe: data,
      })
    ),

    // Bleed
    on(DashboardAction.onClearBleed, (state: DashboardFeatureState) => ({
      ...state,
      bleed: [],
    })),
    on(
      DashboardAction.onLoadBleed,
      (state: DashboardFeatureState, { data }) => ({
        ...state,
        bleed: data,
      })
    ),

    // Asdcs
    on(DashboardAction.onClearAsdcs, (state: DashboardFeatureState) => ({
      ...state,
      asdcs: [],
    })),
    on(
      DashboardAction.onLoadAsdcs,
      (state: DashboardFeatureState, { data }) => ({
        ...state,
        asdcs: data,
      })
    ),

    // Cml
    on(DashboardAction.onClearCml, (state: DashboardFeatureState) => ({
      ...state,
      cml: [],
    })),
    on(DashboardAction.onLoadCml, (state: DashboardFeatureState, { data }) => ({
      ...state,
      cml: data,
    })),

    // Repetitive
    on(DashboardAction.onClearRepetitive, (state: DashboardFeatureState) => ({
      ...state,
      repetitive: [],
    })),
    on(
      DashboardAction.onLoadRepetitive,
      (state: DashboardFeatureState, { data }) => ({
        ...state,
        repetitive: data,
      })
    ),

    // Pack
    on(DashboardAction.onClearPack, (state: DashboardFeatureState) => ({
      ...state,
      pack: [],
    })),
    on(
      DashboardAction.onLoadPack,
      (state: DashboardFeatureState, { data }) => ({
        ...state,
        pack: data,
      })
    ),

    // Hil
    on(DashboardAction.onClearHil, (state: DashboardFeatureState) => ({
      ...state,
      hil: [],
    })),
    on(DashboardAction.onLoadHil, (state: DashboardFeatureState, { data }) => ({
      ...state,
      hil: data,
    })),

    // Set Config
    on(DashboardAction.onClearConfigData, (state: DashboardFeatureState) => ({
      ...state,
      configData: [],
    })),

    on(
      DashboardAction.OnLoadConfigData,
      (state: DashboardFeatureState, data: SetConfigDTO) => ({
        ...state,
        configData: [...state.configData, data],
      })
    ),

    on(DashboardAction.resetDashboardState, () => initialState)
  ),
});
