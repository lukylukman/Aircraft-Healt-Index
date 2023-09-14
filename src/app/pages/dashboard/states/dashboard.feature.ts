import { createFeature, createReducer, on } from "@ngrx/store";
import { PaginationResultDTO } from "src/app/core/dto/pagination.result.dto";
import { ImsPaginationDTO } from "../dto/ims-pagination.dto";
import { AircraftDTO } from "../dto/aircraft.dto";
import * as DashboardAction from './dashboard.action'; 

const empetyStateDashboard: PaginationResultDTO<AircraftDTO> = {
  data: [],
  currentPage: 0,
  totalItems: 0,
  totalItemsPerPage: 0,
  lastPage: 0,
  hasNext: false,
  hasPrev: false,
}

export interface DashboardFeatureState {
  dashboard: PaginationResultDTO<AircraftDTO>;
  selectedDashboard: AircraftDTO | null;
}

const initialState: DashboardFeatureState = {
  dashboard: empetyStateDashboard,
  selectedDashboard: null
};

export const DashboardFeature = createFeature({
  name: 'DashboardFeature',
  reducer: createReducer(
    initialState,
    on(
      DashboardAction.onDashboardLoaded,
      (state: DashboardFeatureState, data: PaginationResultDTO<AircraftDTO>) => ({
        ...state,
        Dashboard: data,
      }),
    ),
    on(
      DashboardAction.onDashboardSelected,
      (state: DashboardFeatureState, data: AircraftDTO) => ({
        ...state,
        selectedDashboard: data,
      }),
    ),

    on(DashboardAction.onDashboardClear, (state: DashboardFeatureState) => ({
      ...state,
      dashboardData: [],
    })),
  )
})