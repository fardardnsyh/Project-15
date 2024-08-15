import '@angular/compiler';

import * as DashboardSelectors from './dashboard.selectors';

describe('Dashboard Selectors', () => {
  const initialState = {
    dashboard: {
      loadAssignedDataInProgress: false,
      loadAssignedDataError: 'Error loading data',
      loadAssignedDataSuccess: true,
    },
  };

  it('should select the loadAssignedDataInProgress state', () => {
    const result =
      DashboardSelectors.selectDashboardLoadAssignedDataInProgress.projector(
        initialState.dashboard
      );
    expect(result).toBe(false);
  });

  it('should select the loadAssignedDataError state', () => {
    const result =
      DashboardSelectors.selectDashboardLoadAssignedDataError.projector(
        initialState.dashboard
      );
    expect(result).toBe('Error loading data');
  });

  it('should select the loadAssignedDataSuccess state', () => {
    const result =
      DashboardSelectors.selectDashboardLoadAssignedDataSuccess.projector(
        initialState.dashboard
      );
    expect(result).toBe(true);
  });
});
