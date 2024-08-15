import '@angular/compiler';
import {
  dashboardReducer,
  DashboardState,
  initialDashboardState,
} from './dashboard.reducer';
import * as DashboardActions from './dashboard.actions';
import { HttpErrorResponse } from '@angular/common/http';

describe('dashboardReducer', () => {
  it('should set loadAssignedDataInProgress to true', () => {
    const action = DashboardActions.loadAssignedData();
    const state = dashboardReducer(initialDashboardState, action);

    expect(state.loadAssignedDataInProgress).toBe(true);
    expect(state.loadAssignedDataSuccess).toBe(false);
    expect(state.loadAssignedDataError).toBeNull();
  });

  it('should update the state to reflect the loading success', () => {
    const prevState: DashboardState = {
      ...initialDashboardState,
      loadAssignedDataInProgress: true,
    };
    const mockSuccessPayload = {
      data: {},
    };

    const action = DashboardActions.loadAssignedDataSuccess({
      payload: mockSuccessPayload as any,
    });
    const state = dashboardReducer(prevState, action);

    expect(state.loadAssignedDataInProgress).toBe(false);
    expect(state.loadAssignedDataSuccess).toBe(true);
    expect(state.loadAssignedDataError).toBeNull();
  });

  it('should update the state to reflect the loading failure', () => {
    const expectedErrorMessage =
      'Http failure response for (unknown url): 400 Bad Request';
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      error: 'Error loading data',
      status: 400,
      statusText: 'Bad Request',
      url: '',
    });

    const prevState: DashboardState = {
      ...initialDashboardState,
      loadAssignedDataInProgress: true,
    };

    const action = DashboardActions.loadAssignedDataFail({
      payload: { error: errorResponse } as any,
    });

    const state = dashboardReducer(prevState, action);

    expect(state.loadAssignedDataInProgress).toBe(false);
    expect(state.loadAssignedDataSuccess).toBe(false);
    expect(state.loadAssignedDataError).toBe(expectedErrorMessage);
  });

  it('should reset loadAssignedDataSuccess to false', () => {
    const prevState: DashboardState = {
      ...initialDashboardState,
      loadAssignedDataSuccess: true,
    };
    const action = DashboardActions.resetLoadAssignedDataSuccess();
    const state = dashboardReducer(prevState, action);

    expect(state.loadAssignedDataSuccess).toBe(false);
  });
});
