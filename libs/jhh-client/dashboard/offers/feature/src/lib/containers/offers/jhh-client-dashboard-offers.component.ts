import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

import { TableComponent } from '../../components/table/table.component';
import { AddComponent } from '../../components/add/add.component';
import { JhhClientDashboardEditOfferComponent } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { JhhClientDashboardRemoveOffersComponent } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';

import { Offer } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-offers',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    AddComponent,
    JhhClientDashboardEditOfferComponent,
    JhhClientDashboardRemoveOffersComponent,
  ],
  templateUrl: './jhh-client-dashboard-offers.component.html',
  styleUrls: ['./jhh-client-dashboard-offers.component.scss'],
})
export class JhhClientDashboardOffersComponent implements OnInit {
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  offers$: Observable<Offer[]>;

  ngOnInit(): void {
    this.offers$ = this.offersFacade.offers$;
  }
}
