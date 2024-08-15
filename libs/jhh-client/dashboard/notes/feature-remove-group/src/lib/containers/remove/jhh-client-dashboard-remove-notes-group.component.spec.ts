import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardRemoveNotesGroupComponent } from './jhh-client-dashboard-remove-notes-group.component';

import { RemoveNotesGroupDialogService } from '../../services/remove-notes-group-dialog.service';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NotesGroup } from '@prisma/client';

describe('JhhClientDashboardRemoveNotesGroupComponent', () => {
  let component: JhhClientDashboardRemoveNotesGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemoveNotesGroupComponent>;
  let mockRemoveNotesGroupDialogService: jest.Mocked<RemoveNotesGroupDialogService>;
  let mockNotesFacade;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockRemoveNotesGroupDialogService = {
      notesGroupToRemove$: new BehaviorSubject<NotesGroup | undefined>(
        undefined
      ),
    } as unknown as jest.Mocked<RemoveNotesGroupDialogService>;
    mockNotesFacade = {};

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemoveNotesGroupComponent],
      providers: [
        {
          provide: RemoveNotesGroupDialogService,
          useValue: mockRemoveNotesGroupDialogService,
        },
        { provide: NotesFacade, useValue: mockNotesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardRemoveNotesGroupComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe and update notesGroupToRemove$ from service', () => {
    const mockNotesGroup: NotesGroup = {
      id: '1',
      name: 'Test Group',
      notes: [],
    } as unknown as NotesGroup;

    // @ts-ignore
    mockRemoveNotesGroupDialogService.notesGroupToRemove$.next(mockNotesGroup);

    fixture.detectChanges();

    component.notesGroupToRemove$.subscribe((group) => {
      expect(group).toEqual(mockNotesGroup);
    });
  });
});
