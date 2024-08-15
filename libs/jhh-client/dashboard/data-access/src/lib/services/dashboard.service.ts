import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ApiRoute } from '@jhh/shared/domain';

import { environment } from '@jhh/jhh-client/shared/config';

import {
  LoadAssignedDataSuccessPayload,
  LoadAssignedDataSuccessResponse,
} from '@jhh/jhh-client/dashboard/domain';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  loadAssignedData(): Observable<LoadAssignedDataSuccessPayload> {
    return this.http
      .get<LoadAssignedDataSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.LoadAssignedData,
        {}
      )
      .pipe(map((res: LoadAssignedDataSuccessResponse) => res.data));
  }
}
