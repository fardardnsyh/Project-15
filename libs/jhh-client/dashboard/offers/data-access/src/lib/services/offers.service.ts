import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/domain';
import {
  AddOfferPayload,
  AddOfferSuccessPayload,
  AddOfferSuccessResponse,
  EditOfferPayload,
  EditOfferSuccessPayload,
  EditOfferSuccessResponse,
  RemoveOffersPayload,
  RemoveOffersSuccessPayload,
  RemoveOffersSuccessResponse,
} from '@jhh/jhh-client/dashboard/offers/domain';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  addOffer(payload: AddOfferPayload): Observable<AddOfferSuccessPayload> {
    return this.http
      .post<AddOfferSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddOffer,
        {
          position: payload.position,
          link: payload.link,
          company: payload.company,
          companyType: payload.companyType,
          location: payload.location,
          status: payload.status,
          priority: payload.priority,
          minSalary: payload.minSalary,
          maxSalary: payload.maxSalary,
          salaryCurrency: payload.salaryCurrency,
          email: payload.email,
          description: payload.description,
        }
      )
      .pipe(map((res: AddOfferSuccessResponse) => res.data));
  }

  editOffer(payload: EditOfferPayload): Observable<EditOfferSuccessPayload> {
    return this.http
      .put<EditOfferSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditOffer,
        {
          offerId: payload.offerId,
          slug: payload.slug,
          position: payload.position,
          link: payload.link,
          company: payload.company,
          companyType: payload.companyType,
          location: payload.location,
          status: payload.status,
          priority: payload.priority,
          minSalary: payload.minSalary,
          maxSalary: payload.maxSalary,
          salaryCurrency: payload.salaryCurrency,
          email: payload.email,
          description: payload.description,
        }
      )
      .pipe(map((res: EditOfferSuccessResponse) => res.data));
  }

  removeOffers(
    payload: RemoveOffersPayload
  ): Observable<RemoveOffersSuccessPayload> {
    return this.http
      .delete<RemoveOffersSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveOffers,
        {
          params: { offersId: payload.offersId },
        }
      )
      .pipe(map((res: RemoveOffersSuccessResponse) => res.data));
  }
}
