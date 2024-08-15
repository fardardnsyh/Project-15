import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { LoadAssignedDataSuccessPayload } from '@jhh/jhh-client/dashboard/domain';

export enum Type {
  LoadAssignedData = '[Dashboard] Load Assigned Data',
  LoadAssignedDataFail = '[Dashboard] Load Assigned Data Fail',
  LoadAssignedDataSuccess = '[Dashboard] Load Assigned Data Success',
  ResetLoadAssignedDataSuccess = '[Dashboard] Reset Load Assigned Data Success',
}

export const loadAssignedData = createAction(Type.LoadAssignedData);

export const loadAssignedDataFail = createAction(
  Type.LoadAssignedDataFail,
  props<{ payload: HttpErrorResponse }>()
);

export const loadAssignedDataSuccess = createAction(
  Type.LoadAssignedDataSuccess,
  props<{ payload: LoadAssignedDataSuccessPayload }>()
);

export const resetLoadAssignedDataSuccess = createAction(
  Type.ResetLoadAssignedDataSuccess
);
