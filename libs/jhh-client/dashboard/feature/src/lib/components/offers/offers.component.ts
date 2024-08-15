import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';

import { Offer } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

interface ExtendedOffer extends Offer {
  statusIcon: string;
}

@Component({
  selector: 'jhh-home-offers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnChanges {
  @Input({ required: true }) offers: Offer[];

  readonly clientRoute: typeof ClientRoute = ClientRoute;

  extendedOffers: ExtendedOffer[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.extendOffers();
    }
  }

  private extendOffers(): void {
    this.extendedOffers = this.offers.map((offer) => ({
      ...offer,
      statusIcon: GetOfferStatusIcon(offer.status),
    }));
  }
}
