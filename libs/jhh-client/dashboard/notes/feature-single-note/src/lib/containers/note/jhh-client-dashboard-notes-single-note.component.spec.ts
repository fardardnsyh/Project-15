import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardNotesSingleNoteComponent } from './jhh-client-dashboard-notes-single-note.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

describe('JhhClientDashboardNotesSingleNoteComponent', () => {
  let component: JhhClientDashboardNotesSingleNoteComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesSingleNoteComponent>;

  const mockNotesFacade = {
    getNote$BySlugs: jest.fn().mockReturnValue(of()),
    getRelatedNotes$: jest.fn().mockReturnValue(of()),
  };

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        JhhClientDashboardNotesSingleNoteComponent,
      ],
      providers: [
        { provide: NotesFacade, useValue: mockNotesFacade },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ noteSlug: 'test-slug' }),
            parent: { params: of({ groupSlug: 'test-group-slug' }) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardNotesSingleNoteComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call NotesFacade with correct parameters', () => {
    const expectedGroupSlug: string = 'test-group-slug';
    const expectedNoteSlug: string = 'test-slug';

    component.ngOnInit();

    expect(mockNotesFacade.getNote$BySlugs).toHaveBeenCalledWith(
      expectedGroupSlug,
      expectedNoteSlug
    );
  });
});
