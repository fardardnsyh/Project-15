import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';

import { Offer } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-offer-controls',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly editOfferDialogService: EditOfferDialogService = inject(
    EditOfferDialogService
  );
  private readonly removeOffersDialogService: RemoveOffersDialogService =
    inject(RemoveOffersDialogService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  @Input({ required: true }) offer: Offer;

  editOfferSuccess$: Observable<boolean>;
  removeOffersSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.editOfferSuccess$ = this.offersFacade.editOfferSuccess$;
    this.removeOffersSuccess$ = this.offersFacade.removeOffersSuccess$;

    this.navigateAfterSlugChange();
    this.navigateAfterRemove();
  }

  openEditOfferDialog(): void {
    this.editOfferDialogService.openDialog(this.offer);
  }

  openRemoveOffersDialog(): void {
    this.removeOffersDialogService.openDialog([this.offer]);
  }

  private navigateAfterSlugChange(): void {
    this.editOfferSuccess$
      .pipe(
        filter((success) => success),
        switchMap(() => this.offersFacade.getOfferSlug$ById(this.offer.id)),
        filter((newSlug) => newSlug !== null && newSlug !== this.offer.slug),
        tap((newSlug) => {
          const currentUrlSegments: string[] = this.router.url.split('/');
          const slugIndex: number = currentUrlSegments.findIndex(
            (segment) => segment === this.offer.slug
          );

          if (slugIndex !== -1) {
            currentUrlSegments[slugIndex] = newSlug!;
            const newOfferLink: string = currentUrlSegments.join('/');

            this.router
              .navigate([''], { skipLocationChange: true })
              .then(() => {
                this.router.navigate([newOfferLink]);
              });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private navigateAfterRemove(): void {
    this.removeOffersSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.router.navigate([this.router.url.replace(this.offer.slug, '')]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
