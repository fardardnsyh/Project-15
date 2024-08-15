import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { Breadcrumb } from '@jhh/jhh-client/dashboard/domain';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private readonly router: Router = inject(Router);

  breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<
    Breadcrumb[]
  >([]);

  private manualUpdates: Record<string, string> = {};

  constructor() {
    this.updateBreadcrumbs();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs(): void {
    let updatedBreadcrumbs = this.createBreadcrumbs(
      this.router.routerState.snapshot.root
    );

    for (const breadcrumb of updatedBreadcrumbs) {
      if (this.manualUpdates[breadcrumb.url]) {
        breadcrumb.label = this.manualUpdates[breadcrumb.url];
      }
    }

    this.breadcrumbs$.next(updatedBreadcrumbs);
  }

  updateBreadcrumbLabelByUrl(url: string, newLabel: string): void {
    this.manualUpdates[url] = newLabel;
    const currentBreadcrumbs: Breadcrumb[] = this.breadcrumbs$.getValue();
    const breadcrumbToUpdate: Breadcrumb | undefined = currentBreadcrumbs.find(
      (bc) => bc.url === url
    );

    if (breadcrumbToUpdate) {
      breadcrumbToUpdate.label = newLabel;
      this.breadcrumbs$.next(currentBreadcrumbs);
    }
  }

  private createBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRouteSnapshot[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURLSegments = child.url.map((segment) => segment.path);

      for (const segment of routeURLSegments) {
        url = `${url}/${segment}`;
        const label =
          child.routeConfig && child.routeConfig.title
            ? child.routeConfig.title
            : segment;
        breadcrumbs.push({ label: label as string, url: url });
      }

      this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
