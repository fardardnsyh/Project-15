import { TestBed } from '@angular/core/testing';
import { ActionResolverService } from './action-resolver.service';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { Actions } from '@ngrx/effects';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

const inject = require('@angular/core').inject;

describe('ActionResolverService', () => {
  let service: ActionResolverService;
  let actions$: Subject<any>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(ActionResolverService);
    actions$ = new Subject();

    inject.mockImplementation((token: any) => {
      if (token === Actions) {
        return actions$;
      }
      return null;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
