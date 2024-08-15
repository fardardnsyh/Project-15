import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OffersPerPage } from '@jhh/jhh-client/dashboard/offers/domain';

enum ParamKey {
  Filter = 'filter',
  Sort = 'sort',
  Page = 'page',
  PerPage = 'per_page',
}

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly location: Location = inject(Location);

  readonly defaultFilter: string = '';
  readonly defaultSort: string = '';
  readonly defaultPage: number = 1;
  readonly defaultPerPage: number = OffersPerPage.Ten;

  private readonly currentFilter$: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.defaultFilter);
  private readonly currentSort$: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.defaultSort);
  private readonly currentPage$: BehaviorSubject<number> =
    new BehaviorSubject<number>(this.defaultPage);
  private readonly currentPerPage$: BehaviorSubject<number> =
    new BehaviorSubject<number>(this.defaultPerPage);

  getAllQueryParams$() {
    return combineLatest([
      this.currentFilter$,
      this.currentSort$,
      this.currentPage$,
      this.currentPerPage$,
    ]).pipe(
      map(([filter, sort, page, perPage]) => {
        return { filter, sort, page, perPage };
      })
    );
  }

  updateCurrentFilter(newFilter: string): void {
    this.currentFilter$.next(newFilter);
    this.updateQueryParams();
  }

  updateCurrentSort(newSort: string): void {
    if (newSort !== this.currentSort$.getValue()) {
      this.currentSort$.next(newSort);
      this.currentPage$.next(this.defaultPage);
      this.updateQueryParams();
    }
  }

  updateCurrentPage(newPage: number): void {
    this.currentPage$.next(newPage);
    this.updateQueryParams();
  }

  updateCurrentPerPage(newPerPage: OffersPerPage): void {
    this.currentPerPage$.next(newPerPage);
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const urlWithoutParams: string = this.router.url.split('?')[0];
    const newUrl: string = `${urlWithoutParams}?${
      ParamKey.Filter
    }=${this.currentFilter$.getValue()}&${
      ParamKey.Sort
    }=${this.currentSort$.getValue()}&${
      ParamKey.Page
    }=${this.currentPage$.getValue()}&${
      ParamKey.PerPage
    }=${this.currentPerPage$.getValue()}`;
    this.location.replaceState(newUrl);
  }

  setFromCurrentRoute(): void {
    const params: ParamMap = this.route.snapshot.queryParamMap;
    this.currentFilter$.next(
      String(params.get(ParamKey.Filter)) || this.defaultFilter
    );
    this.currentSort$.next(
      String(params.get(ParamKey.Sort)) || this.defaultSort
    );
    this.currentPage$.next(
      Number(params.get(ParamKey.Page)) || this.defaultPage
    );
    this.currentPerPage$.next(
      Number(params.get(ParamKey.PerPage)) || this.defaultPerPage
    );
  }
}
