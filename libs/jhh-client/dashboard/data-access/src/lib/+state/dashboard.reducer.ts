import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import * as DashboardActions from './dashboard.actions';

export const DASHBOARD_STATE_KEY = 'dashboard';

export interface DashboardState {
  loadAssignedDataInProgress: boolean;
  loadAssignedDataError: string | null;
  loadAssignedDataSuccess: boolean;
}

export interface DashboardPartialState {
  readonly [DASHBOARD_STATE_KEY]: DashboardState;
}

export const initialDashboardState: DashboardState = {
  loadAssignedDataInProgress: false,
  loadAssignedDataError: null,
  loadAssignedDataSuccess: false,
};

const reducer: ActionReducer<DashboardState> = createReducer(
  initialDashboardState,
  on(DashboardActions.loadAssignedData, (state) => ({
    ...state,
    loadAssignedDataInProgress: true,
  })),
  on(DashboardActions.loadAssignedDataFail, (state, { payload }) => ({
    ...state,
    loadAssignedDataInProgress: false,
    loadAssignedDataError: payload.error.message,
  })),
  on(DashboardActions.loadAssignedDataSuccess, (state, { payload }) => ({
    ...state,
    loadAssignedDataInProgress: false,
    loadAssignedDataSuccess: true,
  })),
  on(DashboardActions.resetLoadAssignedDataSuccess, (state) => ({
    ...state,
    loadAssignedDataSuccess: false,
  }))
);

export function dashboardReducer(
  state: DashboardState | undefined,
  action: Action
) {
  return reducer(state, action);
}
