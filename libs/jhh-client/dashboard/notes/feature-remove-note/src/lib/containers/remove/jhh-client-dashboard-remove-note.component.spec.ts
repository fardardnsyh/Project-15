import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardRemoveNoteComponent } from './jhh-client-dashboard-remove-note.component';

import { RemoveNoteDialogService } from '../../services/remove-note-dialog.service';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { Note } from '@prisma/client';

describe('JhhClientDashboardRemoveNoteComponent', () => {
  let component: JhhClientDashboardRemoveNoteComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemoveNoteComponent>;
  let mockRemoveNoteDialogService: jest.Mocked<RemoveNoteDialogService>;
  let mockNotesFacade;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockRemoveNoteDialogService = {
      noteToRemove$: new BehaviorSubject<Note | undefined>(undefined),
    } as unknown as jest.Mocked<RemoveNoteDialogService>;
    mockNotesFacade = {};

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemoveNoteComponent],
      providers: [
        {
          provide: RemoveNoteDialogService,
          useValue: mockRemoveNoteDialogService,
        },
        { provide: NotesFacade, useValue: mockNotesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardRemoveNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe and update noteToRemove$ from service', () => {
    const mockNote: Note = {
      id: '1',
      name: 'Test Note',
    } as unknown as Note;

    // @ts-ignore
    mockRemoveNoteDialogService.noteToRemove$.next(mockNote);

    fixture.detectChanges();

    component.noteToRemove$.subscribe((note) => {
      expect(note).toEqual(mockNote);
    });
  });
});
