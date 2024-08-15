import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';

import { TitleService } from './title.service';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('TitleService', () => {
  let service: TitleService;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockTitle: Title;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    mockRouter = {
      events: of(new NavigationEnd(0, '/test', '/test')),
    };

    const routeSnapshot: ActivatedRoute = {
      firstChild: null,
      snapshot: { title: 'Test Title' },
    } as unknown as ActivatedRoute;
    mockActivatedRoute = { root: routeSnapshot };

    mockTitle = { setTitle: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        TitleService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Title, useValue: mockTitle },
      ],
    });

    service = TestBed.inject(TitleService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should update title on route change', () => {
    service.title$.subscribe((title) => {
      expect(title).toBe('Test Title');
    });
  });

  it('should set document title using setTitle', () => {
    const newTitle: string = 'New Title';
    service.setTitle(newTitle);

    expect(mockTitle.setTitle).toHaveBeenCalledWith(newTitle);
    service.title$.subscribe((title) => {
      expect(title).toBe(newTitle);
    });
  });
});
