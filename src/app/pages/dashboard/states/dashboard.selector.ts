import { createFeatureSelector } from "@ngrx/store";
import { DashboardFeature, DashboardFeatureState } from "./dashboard.feature";

export const DashboardState = createFeatureSelector<DashboardFeatureState>(
  DashboardFeature.name,
)