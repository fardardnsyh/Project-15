import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DASHBOARD_STATE_KEY, DashboardState } from './dashboard.reducer';

export const selectDashboardState =
  createFeatureSelector<DashboardState>(DASHBOARD_STATE_KEY);

export const selectDashboardLoadAssignedDataInProgress = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loadAssignedDataInProgress
);

export const selectDashboardLoadAssignedDataError = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loadAssignedDataError
);

export const selectDashboardLoadAssignedDataSuccess = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loadAssignedDataSuccess
);
