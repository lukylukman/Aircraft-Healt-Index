import { createFeature, createReducer, on } from '@ngrx/store';
import { PaginationResultDTO } from 'src/app/core/dto/pagination.result.dto';
import { AhiSummaryScoreDTO } from '../dto/ahi-summary-score.dto';
import { AircraftTypeDTO } from '../dto/aircraft-type.dto';
import { AircraftDTO } from '../dto/aircraft.dto';
import * as DashboardAction from './dashboard.action';

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
  selectedDashboard: AircraftDTO | null;
  ahiSummaryScore: AhiSummaryScoreDTO;
  aircraftType: AircraftTypeDTO[];
}

const initialState: DashboardFeatureState = {
  dashboard: empetyStateDashboard,
  selectedDashboard: null,
  aircraftLists: [],
  ahiSummaryScore: {
    amountOfGreenItems: 0,
    amountOfYellowItems: 0,
    amountOfRedItems: 0,
  },
  aircraftType: [],
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

    on(DashboardAction.onDashboardClear, (state: DashboardFeatureState) => ({
      ...state,
      dashboardData: [],
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
    )
  ),
});
