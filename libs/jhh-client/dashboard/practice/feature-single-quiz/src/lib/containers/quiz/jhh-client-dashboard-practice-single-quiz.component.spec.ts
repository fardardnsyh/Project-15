import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { JhhClientDashboardPracticeSingleQuizComponent } from './jhh-client-dashboard-practice-single-quiz.component';

import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('JhhClientDashboardPracticeSingleQuizComponent', () => {
  let component: JhhClientDashboardPracticeSingleQuizComponent;
  let fixture: ComponentFixture<JhhClientDashboardPracticeSingleQuizComponent>;
  let mockActivatedRoute: any,
    mockRouter: any,
    mockBreadcrumbsService: any,
    mockTitleService: any,
    mockBreakpointService: any,
    mockPracticeFacade: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ quizSlug: 'test-quiz' }),
    };
    mockRouter = { navigate: jest.fn() };
    mockBreadcrumbsService = { updateBreadcrumbLabelByUrl: jest.fn() };
    mockTitleService = { setTitle: jest.fn() };
    mockBreakpointService = { breakpoint$: of('desktop') };
    mockPracticeFacade = {
      getQuiz$BySlug: jest.fn().mockReturnValue(
        of({
          name: 'Test Quiz',
          items: [],
          results: [],
        })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardPracticeSingleQuizComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: BreadcrumbsService, useValue: mockBreadcrumbsService },
        { provide: TitleService, useValue: mockTitleService },
        { provide: BreakpointService, useValue: mockBreakpointService },
        { provide: PracticeFacade, useValue: mockPracticeFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardPracticeSingleQuizComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize breakpoint observable', () => {
    expect(component.breakpoint$).toBeInstanceOf(Observable);
  });

  it('should toggle play mode', () => {
    component.isPlayMode$.next(true);
    fixture.detectChanges();

    expect(component.isPlayMode$.getValue()).toBe(true);
  });

  it('should enable quiz shuffling and set question limit', () => {
    component.isQuizShuffled$.next(true);
    component.questionsLimit$.next(5);

    fixture.detectChanges();

    expect(component.isQuizShuffled$.getValue()).toBe(true);
    expect(component.questionsLimit$.getValue()).toBe(5);
  });
});
