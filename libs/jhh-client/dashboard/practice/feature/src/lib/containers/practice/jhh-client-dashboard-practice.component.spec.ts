import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardPracticeComponent } from './jhh-client-dashboard-practice.component';

import { QueryParamsService } from '@jhh/jhh-client/dashboard/data-access';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { QuizzesSort } from '@jhh/jhh-client/dashboard/practice/domain';
import { Quiz } from '@jhh/shared/domain';

describe('JhhClientDashboardPracticeComponent', () => {
  let component: JhhClientDashboardPracticeComponent;
  let fixture: ComponentFixture<JhhClientDashboardPracticeComponent>;

  const mockQueryParamsService = {
    setFromCurrentRoute: jest.fn(),
    updateQueryParams: jest.fn(),
    clearQueryParams: jest.fn(),
    getCurrentPage$: jest.fn(() => of(1)),
    getCurrentSort$: jest.fn(() => of(QuizzesSort.Latest)),
    updateCurrentPage: jest.fn(),
    updateCurrentSort: jest.fn(),
    defaultSort: QuizzesSort.Latest,
    defaultPage: 1,
  };

  const mockPracticeFacade = {
    addQuizSuccess$: of(false),
    quizzes$: of([]),
    searchQuizzes$ByName: jest.fn(() => of([])),
  };

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardPracticeComponent],
      providers: [
        { provide: QueryParamsService, useValue: mockQueryParamsService },
        { provide: PracticeFacade, useValue: mockPracticeFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    TestBed.runInInjectionContext(() => {
      expect(component).toBeTruthy();
    });
  });

  it('should set queryParamsService from current route on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(mockQueryParamsService.setFromCurrentRoute).toHaveBeenCalled();
    });
  });

  it('should handle empty quizzes$ observable on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(practiceComponent.quizzes$).toBeDefined();
      practiceComponent.quizzes$.subscribe((quizzes) => {
        expect(quizzes).toEqual([]);
      });
    });
  });

  it('should set quizzes$ observable from practiceFacade.quizzes$ on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(practiceComponent.quizzes$).toEqual(mockPracticeFacade.quizzes$);
    });
  });

  it('should set defaultSort from queryParamsService.defaultSort on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(practiceComponent.defaultSort).toEqual(
        mockQueryParamsService.defaultSort
      );
    });
  });

  it('should set defaultPage from queryParamsService.defaultPage on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(practiceComponent.defaultPage).toEqual(
        mockQueryParamsService.defaultPage
      );
    });
  });

  it('should call queryParamsService.updateQueryParams() on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(mockQueryParamsService.updateQueryParams).toHaveBeenCalled();
    });
  });

  it('should set quizzesPerPage to 12 on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(practiceComponent.quizzesPerPage).toBe(12);
    });
  });

  it('should set sortOptionsValues to Object.values(QuizzesSort) on ngOnInit', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      practiceComponent.ngOnInit();
      expect(practiceComponent.sortOptionsValues).toEqual(
        Object.values(QuizzesSort)
      );
    });
  });

  it('should sort quizzes by oldest', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      const quizzes: Quiz[] = [
        {
          id: '1',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01'),
          name: 'Quiz 1',
          slug: 'quiz-1',
          items: [],
          results: [],
        },
        {
          id: '2',
          createdAt: new Date('2022-01-02'),
          updatedAt: new Date('2022-01-02'),
          name: 'Quiz 2',
          slug: 'quiz-2',
          items: [],
          results: [],
        },
        {
          id: '3',
          createdAt: new Date('2022-01-03'),
          updatedAt: new Date('2022-01-03'),
          name: 'Quiz 3',
          slug: 'quiz-3',
          items: [],
          results: [],
        },
      ];
      const sortedQuizzes = practiceComponent['sortQuizzes'](
        quizzes,
        QuizzesSort.Oldest
      );
      expect(sortedQuizzes).toEqual([
        {
          id: '1',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01'),
          name: 'Quiz 1',
          slug: 'quiz-1',
          items: [],
          results: [],
        },
        {
          id: '2',
          createdAt: new Date('2022-01-02'),
          updatedAt: new Date('2022-01-02'),
          name: 'Quiz 2',
          slug: 'quiz-2',
          items: [],
          results: [],
        },
        {
          id: '3',
          createdAt: new Date('2022-01-03'),
          updatedAt: new Date('2022-01-03'),
          name: 'Quiz 3',
          slug: 'quiz-3',
          items: [],
          results: [],
        },
      ]);
    });
  });

  it('should sort quizzes by last edited', () => {
    TestBed.runInInjectionContext(() => {
      const practiceComponent = new JhhClientDashboardPracticeComponent();
      const quizzes: Quiz[] = [
        {
          id: '1',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-03'),
          name: 'Quiz 1',
          slug: 'quiz-1',
          items: [],
          results: [],
        },
        {
          id: '2',
          createdAt: new Date('2022-01-02'),
          updatedAt: new Date('2022-01-02'),
          name: 'Quiz 2',
          slug: 'quiz-2',
          items: [],
          results: [],
        },
        {
          id: '3',
          createdAt: new Date('2022-01-03'),
          updatedAt: new Date('2022-01-01'),
          name: 'Quiz 3',
          slug: 'quiz-3',
          items: [],
          results: [],
        },
      ];
      const sortedQuizzes = practiceComponent['sortQuizzes'](
        quizzes,
        QuizzesSort.LastEdited
      );
      expect(sortedQuizzes).toEqual([
        {
          id: '1',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-03'),
          name: 'Quiz 1',
          slug: 'quiz-1',
          items: [],
          results: [],
        },
        {
          id: '2',
          createdAt: new Date('2022-01-02'),
          updatedAt: new Date('2022-01-02'),
          name: 'Quiz 2',
          slug: 'quiz-2',
          items: [],
          results: [],
        },
        {
          id: '3',
          createdAt: new Date('2022-01-03'),
          updatedAt: new Date('2022-01-01'),
          name: 'Quiz 3',
          slug: 'quiz-3',
          items: [],
          results: [],
        },
      ]);
    });
  });
});
