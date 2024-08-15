import { inject, Injectable } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private readonly breakpointObserver: BreakpointObserver =
    inject(BreakpointObserver);

  breakpoint$: Observable<string>;

  constructor() {
    this.breakpoint$ = this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map((state: BreakpointState) => {
          let breakpoint = 'unknown';
          switch (true) {
            case state.breakpoints[Breakpoints.XSmall]:
            case state.breakpoints[Breakpoints.Small]:
              breakpoint = 'mobile';
              break;
            case state.breakpoints[Breakpoints.Medium]:
              breakpoint = 'tablet';
              break;
            case state.breakpoints[Breakpoints.Large]:
            case state.breakpoints[Breakpoints.XLarge]:
              breakpoint = 'desktop';
              break;
          }
          return breakpoint;
        }),
        distinctUntilChanged()
      );
  }
}
