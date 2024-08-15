import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly location: Location = inject(Location);

  readonly defaultPage: number = 1;
  readonly defaultSort: string = 'Latest';

  private readonly currentPage$: BehaviorSubject<number> =
    new BehaviorSubject<number>(this.defaultPage);
  private readonly currentSort$: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.defaultSort);

  getCurrentPage$(): BehaviorSubject<number> {
    return this.currentPage$;
  }

  getCurrentSort$(): BehaviorSubject<string> {
    return this.currentSort$;
  }

  updateCurrentPage(newPage: number): void {
    this.currentPage$.next(newPage);
    this.updateQueryParams();
  }

  updateCurrentSort(newSort: string): void {
    this.currentSort$.next(newSort);
    this.currentPage$.next(this.defaultPage);
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const urlWithoutParams: string = this.router.url.split('?')[0];
    const newUrl: string = `${urlWithoutParams}?page=${this.currentPage$.getValue()}&sort=${this.currentSort$.getValue()}`;
    this.location.replaceState(newUrl);
  }

  clearQueryParams(): void {
    this.currentPage$.next(this.defaultPage);
    this.currentSort$.next(this.defaultSort);
  }

  setFromCurrentRoute(): void {
    const params = this.route.snapshot.queryParamMap;
    this.currentPage$.next(Number(params.get('page')) || this.defaultPage);
    this.currentSort$.next(params.get('sort') || this.defaultSort);
  }
}
