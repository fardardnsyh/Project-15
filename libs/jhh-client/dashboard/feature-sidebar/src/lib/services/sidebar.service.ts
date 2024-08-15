import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageKey } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly breakpointObserver: BreakpointObserver =
    inject(BreakpointObserver);
  private readonly router: Router = inject(Router);

  private _isBreakpointMobile$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _isSidebarOpened$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _isSidebarExpanded$: BehaviorSubject<boolean>;

  breakpoint$: Observable<BreakpointState>;
  isBreakpointMobile$: Observable<boolean> =
    this._isBreakpointMobile$.asObservable();
  isSidebarOpened$: Observable<boolean> = this._isSidebarOpened$.asObservable();
  isSidebarExpanded$: Observable<boolean>;

  constructor() {
    const expandedState: string | null = localStorage.getItem(
      LocalStorageKey.IsSidebarExpanded
    );
    this._isSidebarExpanded$ = new BehaviorSubject<boolean>(
      expandedState !== null ? expandedState === 'true' : true
    );

    this.isSidebarExpanded$ = this._isSidebarExpanded$.asObservable();

    this.breakpoint$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        distinctUntilChanged((prev, curr) => prev.matches === curr.matches)
      );

    this.handleBreakpoint();
    this.handleRouteChange();
  }

  handleBreakpoint(): void {
    this.breakpoint$.subscribe((val: BreakpointState) => {
      if (val.matches) {
        this._isBreakpointMobile$.next(true);
        this._isSidebarOpened$.next(false);
        this.setSidebarExpandedState(false);
      } else {
        this._isBreakpointMobile$.next(false);
        this._isSidebarOpened$.next(true);
      }
    });
  }

  handleRouteChange(): void {
    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        this._isBreakpointMobile$.getValue()
      ) {
        this._isSidebarOpened$.next(false);
      }
    });
  }

  toggleSidebar(): void {
    this.breakpoint$
      .subscribe((val: BreakpointState) => {
        if (val.matches) {
          this._isSidebarOpened$.next(!this._isSidebarOpened$.getValue());
        } else {
          this.setSidebarExpandedState(!this._isSidebarExpanded$.getValue());
        }
      })
      .unsubscribe();
  }

  private setSidebarExpandedState(newState: boolean): void {
    this._isSidebarExpanded$.next(newState);
    localStorage.setItem(
      LocalStorageKey.IsSidebarExpanded,
      newState.toString()
    );
  }
}
