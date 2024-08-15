import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, filter, Observable, tap } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly titleService: Title = inject(Title);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private _title$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  title$: Observable<string | null> = this._title$.asObservable();

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          let route: ActivatedRoute = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          const defaultTitle: string | undefined = route.snapshot.title;
          if (defaultTitle) this._title$.next(defaultTitle);
        })
      )
      .subscribe();
  }

  setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
    this._title$.next(newTitle);
  }
}
