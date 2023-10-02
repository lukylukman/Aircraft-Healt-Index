import { createFeature, createReducer, on } from '@ngrx/store';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { AhiSummaryScoreDTO } from '../dto/ahi-summary-score.dto';
import { AircraftDetailHilDTO } from '../dto/aircraft-detail-hil.dto';
import { AircraftTypeDTO } from '../dto/aircraft-type.dto';
import { AircraftDTO } from '../dto/aircraft.dto';
import { AverageHealt } from '../dto/average-healt.dto';
import { APURecordDTO } from '../dto/showMoreHil.dto';
import * as DashboardAction from './dashboard.action';
import { ElasticRecordResponse } from '../dashboard.service';
import { SetConfigDTO } from '../dto/setConfig.dto';

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
  aircraftLists: AircraftDTO[];
  selectedDashboard: AircraftDTO;
  ahiSummaryScore: AhiSummaryScoreDTO;
  aircraftType: AircraftTypeDTO[];

  apu: APURecordDTO[];
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
    difference: 0
  },
  aircraftType: [],
  aircraftDetailHil: [],
  apu: [],
  averageHealt: undefined,
  configData: []
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
      (state: DashboardFeatureState, data: AircraftDTO) => ({
        ...state,
        selectedDashboard: data,
      })
    ),
    on(
      DashboardAction.onLoadAircraftList,
      (state: DashboardFeatureState, data: AircraftDTO) => ({
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
    on(
  DashboardAction.onLoadApu,
    (state: DashboardFeatureState, { data }) => ({
      ...state,
      apu: data,
    })
  ),

  // Set Config
  on(
      DashboardAction.onClearConfigData,
      (state: DashboardFeatureState) => ({
        ...state,
        configData: [],
      })
    ),

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
