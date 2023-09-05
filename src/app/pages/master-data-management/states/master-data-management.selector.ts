import { createFeatureSelector } from '@ngrx/store';
import { MasterDataManagementFeature, MasterDataManagementFeatureState } from './master-data-management.feature';

export const MasterDataManagementState = createFeatureSelector<MasterDataManagementFeatureState>(
  MasterDataManagementFeature.name
);
