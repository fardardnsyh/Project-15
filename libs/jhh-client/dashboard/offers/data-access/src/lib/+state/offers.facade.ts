import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  Offer,
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

import * as OffersSelectors from './offers.selectors';
import * as OffersActions from './offers.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable({
  providedIn: 'root',
})
export class OffersFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  offers$: Observable<Offer[]> = this.store.pipe(
    select(OffersSelectors.selectOffers)
  );

  addOfferInProgress$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectAddOfferInProgress)
  );

  addOfferError$: Observable<string | null> = this.store.pipe(
    select(OffersSelectors.selectAddOfferError)
  );

  addOfferSuccess$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectAddOfferSuccess)
  );

  editOfferInProgress$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectEditOfferInProgress)
  );

  editOfferError$: Observable<string | null> = this.store.pipe(
    select(OffersSelectors.selectEditOfferError)
  );

  editOfferSuccess$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectEditOfferSuccess)
  );

  removeOffersInProgress$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectRemoveOffersInProgress)
  );

  removeOffersError$: Observable<string | null> = this.store.pipe(
    select(OffersSelectors.selectRemoveOffersError)
  );

  removeOffersSuccess$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectRemoveOffersSuccess)
  );

  addOffer(
    position: string,
    link: string,
    company: string,
    companyType: OfferCompanyType,
    location: OfferLocation,
    status: OfferStatus,
    priority: OfferPriority,
    minSalary?: number,
    maxSalary?: number,
    salaryCurrency?: OfferSalaryCurrency,
    email?: string,
    description?: string
  ) {
    return this.actionResolverService.executeAndWatch(
      OffersActions.addOffer({
        payload: {
          position,
          link,
          company,
          companyType,
          location,
          status,
          priority,
          minSalary,
          maxSalary,
          salaryCurrency,
          email,
          description,
        },
      }),
      OffersActions.Type.AddOfferSuccess,
      OffersActions.Type.AddOfferFail
    );
  }

  editOffer(
    offerId: string,
    slug: string,
    position: string,
    link: string,
    company: string,
    companyType: OfferCompanyType,
    location: OfferLocation,
    status: OfferStatus,
    priority: OfferPriority,
    minSalary?: number,
    maxSalary?: number,
    salaryCurrency?: OfferSalaryCurrency,
    email?: string,
    description?: string
  ) {
    return this.actionResolverService.executeAndWatch(
      OffersActions.editOffer({
        payload: {
          offerId,
          slug,
          position,
          link,
          company,
          companyType,
          location,
          status,
          priority,
          minSalary,
          maxSalary,
          salaryCurrency,
          email,
          description,
        },
      }),
      OffersActions.Type.EditOfferSuccess,
      OffersActions.Type.EditOfferFail
    );
  }

  removeOffers(offersId: string[]) {
    return this.actionResolverService.executeAndWatch(
      OffersActions.removeOffers({
        payload: { offersId: offersId },
      }),
      OffersActions.Type.RemoveOffersSuccess,
      OffersActions.Type.RemoveOffersFail
    );
  }

  getOffer$BySlug(slug: string): Observable<Offer | undefined> {
    return this.store.pipe(select(OffersSelectors.selectOfferBySlug, slug));
  }

  getOfferSlug$ById(offerId: string): Observable<string | null> {
    return this.store.pipe(
      select(OffersSelectors.selectOfferSlugById, { offerId })
    );
  }

  getLimitedOffers$(length: number = 15): Observable<Offer[]> {
    return this.store.pipe(
      select(OffersSelectors.selectLimitedOffers, { length })
    );
  }

  resetErrors(): void {
    this.store.dispatch(OffersActions.resetErrors());
  }
}
