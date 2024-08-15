import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { OfferStatusUpdate } from '@jhh/shared/domain';
import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';

interface ExtendedOfferStatusUpdate extends OfferStatusUpdate {
  icon: string;
}

@Component({
  selector: 'jhh-offer-status-updates',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './status-updates.component.html',
  styleUrls: ['./status-updates.component.scss'],
})
export class StatusUpdatesComponent implements OnChanges {
  @Input({ required: true }) updates: OfferStatusUpdate[];

  extendedUpdates: ExtendedOfferStatusUpdate[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['updates'] && this.updates.length) {
      this.extendedUpdates = this.updates.map((update) => ({
        ...update,
        icon: GetOfferStatusIcon(update.status),
      }));
    }
  }
}
