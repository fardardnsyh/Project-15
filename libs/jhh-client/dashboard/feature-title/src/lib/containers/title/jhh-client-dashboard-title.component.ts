import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { TitleService } from '../../services/title.service';

import { HeadingComponent } from '../../components/heading/heading.component';

@Component({
  selector: 'jhh-title',
  standalone: true,
  imports: [CommonModule, HeadingComponent],
  templateUrl: './jhh-client-dashboard-title.component.html',
  styleUrls: ['./jhh-client-dashboard-title.component.scss'],
})
export class JhhClientDashboardTitleComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly titleService: TitleService = inject(TitleService);

  currentRouteTitle: string | undefined;
  titleSubscription: Subscription;

  ngOnInit(): void {
    this.titleSubscription = this.titleService.title$
      .pipe(
        tap((newTitle) => {
          if (newTitle !== null) {
            this.currentRouteTitle = newTitle;
          } else {
            this.setDefaultRouteTitle();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private setDefaultRouteTitle(): void {
    let route: ActivatedRoute = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    this.currentRouteTitle = route.snapshot.title;
  }
}
