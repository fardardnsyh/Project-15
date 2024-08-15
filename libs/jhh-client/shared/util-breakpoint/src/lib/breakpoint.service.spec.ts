import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { BreakpointService } from './breakpoint.service';

describe('BreakpointService', () => {
  let service: BreakpointService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreakpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
