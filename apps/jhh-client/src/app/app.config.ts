import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import {
  MAT_DIALOG_SCROLL_STRATEGY,
  MatDialog,
} from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Dialog, DIALOG_SCROLL_STRATEGY } from '@angular/cdk/dialog';

import { AuthInterceptor } from '@jhh/jhh-client/auth/shell';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { DashboardFacade } from '@jhh/jhh-client/dashboard/data-access';

import { environment } from '@jhh/jhh-client/shared/config';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    AuthFacade,
    DashboardFacade,
    provideEffects(),
    provideStore(),
    ...(environment.production
      ? []
      : [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75,
          }),
        ]),
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      inMemoryScrollingFeature
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      FlatpickrModule.forRoot()
    ),
    MatSnackBar,
    MatDialog,
    {
      provide: MAT_DIALOG_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.block(),
      deps: [Overlay],
    },
    Dialog,
    {
      provide: DIALOG_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.block(),
      deps: [Overlay],
    },
  ],
};
