import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { MenuComponent } from './menu.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';

import { Note, NotesGroup } from '@jhh/shared/domain';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockNotesFacade: Partial<NotesFacade>;
  let mockGroups$: Observable<NotesGroup[] | null>;
  let mockEditNoteDialogService: Partial<EditNoteDialogService>,
    mockChangeNoteGroupDialogService: Partial<ChangeNoteGroupDialogService>,
    mockRemoveNoteDialogService: Partial<RemoveNoteDialogService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockGroups$ = of([
      {
        id: '1',
        name: 'name',
        slug: 'slug',
      },
    ] as NotesGroup[]);

    mockNotesFacade = {
      getGroups$: () => mockGroups$,
      duplicateNote: jest.fn(),
    };

    mockEditNoteDialogService = { openDialog: jest.fn() };
    mockChangeNoteGroupDialogService = { openDialog: jest.fn() };
    mockRemoveNoteDialogService = { openDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: NotesFacade, useValue: mockNotesFacade },
        {
          provide: EditNoteDialogService,
          useValue: mockEditNoteDialogService,
        },
        {
          provide: ChangeNoteGroupDialogService,
          useValue: mockChangeNoteGroupDialogService,
        },
        {
          provide: RemoveNoteDialogService,
          useValue: mockRemoveNoteDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    component.note = {
      id: '1',
      name: 'note',
      slug: 'slug',
    } as Note;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openDialog on EditNotesDialogService with the note when openEditNoteDialog is called', () => {
    component.openEditNoteDialog();
    expect(mockEditNoteDialogService.openDialog).toHaveBeenCalledWith(
      component.note
    );
  });

  it('should call openDialog on ChangeNoteGroupDialogService with the note when openChangeNoteGroupDialog is called', () => {
    component.openChangeNoteGroupDialog();
    expect(mockChangeNoteGroupDialogService.openDialog).toHaveBeenCalledWith(
      component.note
    );
  });

  it('should call openDialog on RemoveNoteDialogService with the note when openRemoveNoteDialog is called', () => {
    component.openRemoveNoteDialog();
    expect(mockRemoveNoteDialogService.openDialog).toHaveBeenCalledWith(
      component.note
    );
  });
});
