import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { of } from 'rxjs';

import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;
  let mockBreakpointObserver: any;

  beforeEach(() => {
    mockBreakpointObserver = {
      observe: jest
        .fn()
        .mockReturnValue(of({ matches: false } as BreakpointState)),
    };

    TestBed.configureTestingModule({
      providers: [
        SidebarService,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    });

    service = TestBed.inject(SidebarService);
  });

  describe('handleBreakpoint', () => {
    it('should set isBreakpointMobile to true and others to false when matches', () => {
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true } as BreakpointState)
      );
      service.handleBreakpoint();

      service.isBreakpointMobile$.subscribe((value) => {
        expect(value).toBe(true);
      });

      service.isSidebarOpened$.subscribe((value) => {
        expect(value).toBe(false);
      });

      service.isSidebarExpanded$.subscribe((value) => {
        expect(value).toBe(false);
      });
    });

    it('should set isBreakpointMobile to false and others to true when not matches', () => {
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false } as BreakpointState)
      );
      service.handleBreakpoint();

      service.isBreakpointMobile$.subscribe((value) => {
        expect(value).toBe(false);
      });

      service.isSidebarOpened$.subscribe((value) => {
        expect(value).toBe(true);
      });

      service.isSidebarExpanded$.subscribe((value) => {
        expect(value).toBe(true);
      });
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle isSidebarOpened when matches', () => {
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true } as BreakpointState)
      );
      service.toggleSidebar();

      service.isSidebarOpened$.subscribe((value) => {
        expect(value).toBe(true);
      });
    });

    it('should toggle isSidebarExpanded when not matches', () => {
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false } as BreakpointState)
      );
      service.toggleSidebar();

      service.isSidebarExpanded$.subscribe((value) => {
        expect(value).toBe(true);
      });
    });
  });
});
