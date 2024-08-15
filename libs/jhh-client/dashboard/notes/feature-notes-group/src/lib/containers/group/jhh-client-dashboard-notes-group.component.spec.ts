import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { JhhClientDashboardNotesGroupComponent } from './jhh-client-dashboard-notes-group.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { QueryParamsService } from '@jhh/jhh-client/dashboard/data-access';

import { Note, NotesGroup } from '@jhh/shared/domain';

describe('JhhClientDashboardNotesGroupComponent', () => {
  let component: JhhClientDashboardNotesGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesGroupComponent>;
  let mockNotesFacade: jest.Mocked<NotesFacade>;
  let mockQueryParamsService: jest.Mocked<QueryParamsService>;
  let mockRoute: jest.Mocked<ActivatedRoute>;
  let mockRouter: jest.Mocked<Router>;
  let mockSortOption$: BehaviorSubject<string>;
  let mockQueryParams$: BehaviorSubject<any>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      editNotesGroupSuccess$: of(false),
      removeNotesGroupSuccess$: of(false),
      getNotesGroup$BySlug: jest.fn(),
      searchNotes$ByNameAndGroupId: jest.fn(),
    } as unknown as jest.Mocked<NotesFacade>;

    mockQueryParamsService = {
      setFromCurrentRoute: jest.fn(),
      updateQueryParams: jest.fn(),
      clearQueryParams: jest.fn(),
      getCurrentSort$: jest.fn(),
      getCurrentPage$: jest.fn(),
    } as unknown as jest.Mocked<QueryParamsService>;

    mockSortOption$ = new BehaviorSubject<string>('defaultSortOption');
    mockQueryParams$ = new BehaviorSubject({});

    mockRoute = {
      params: of({ groupSlug: 'test-slug' }),
      queryParams: mockQueryParams$.asObservable(),
    } as unknown as jest.Mocked<ActivatedRoute>;

    mockRouter = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
      routerState: {
        snapshot: {
          root: {
            url: [],
            params: {},
            data: {},
            firstChild: null,
            children: [],
          },
        },
      },
      events: of(new NavigationEnd(0, 'url', 'urlAfterRedirects')),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesGroupComponent, RouterTestingModule],
      providers: [
        { provide: NotesFacade, useValue: mockNotesFacade },
        { provide: QueryParamsService, useValue: mockQueryParamsService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNotesGroupComponent);
    component = fixture.componentInstance;
    component.group$ = of({
      id: 'mockId',
    } as NotesGroup);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    mockQueryParamsService.setFromCurrentRoute.mockReturnValue(of(null) as any);
    mockNotesFacade.getNotesGroup$BySlug.mockReturnValue(of({} as NotesGroup));

    component.ngOnInit();

    expect(mockQueryParamsService.setFromCurrentRoute).toHaveBeenCalled();
    expect(mockNotesFacade.getNotesGroup$BySlug).toHaveBeenCalled();
  });

  it('should clear query parameters on destroy', () => {
    component.ngOnDestroy();

    expect(mockQueryParamsService.clearQueryParams).toHaveBeenCalled();
  });

  it('should set groupSlug$ observable correctly', (done) => {
    const expectedSlug: string = 'test-slug';
    mockRoute.params = of({ groupSlug: expectedSlug });

    component.groupSlug$.subscribe((slug) => {
      expect(slug).toEqual(expectedSlug);
      done();
    });
  });

  it('should correctly search notes', (done) => {
    const testQuery: string = 'test';
    const expectedNotes: Note[] = [{ id: '1', name: 'Note 1' } as Note];
    mockNotesFacade.searchNotes$ByNameAndGroupId.mockReturnValue(
      of(expectedNotes)
    );

    component.group$ = of({
      id: '1',
      name: 'Group 1',
      notes: [],
    } as unknown as NotesGroup);
    component.searchNotes(testQuery).subscribe((notes) => {
      expect(notes).toEqual(expectedNotes);
      done();
    });
  });

  it('should sort notes correctly when sort option changes', () => {
    mockSortOption$.next('Latest');

    component.sortedNotes$.subscribe((sortedNotes) => {
      expect(sortedNotes[0].name).toBe('A');
    });
  });
});
