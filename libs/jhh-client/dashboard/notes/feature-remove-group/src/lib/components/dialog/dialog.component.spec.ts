import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RemoveNotesGroupDialogService } from '../../services/remove-notes-group-dialog.service';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { DialogComponent } from './dialog.component';

import { NotesGroup } from '@jhh/shared/domain';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockNotesFacade: Partial<NotesFacade>, mockRemoveNotesGroupDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      removeNotesGroupInProgress$: of(false),
      removeNotesGroupError$: of(null),
      removeNotesGroup: jest.fn(),
    };
    mockRemoveNotesGroupDialogService = {
      clearNotesGroupToRemove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, DialogComponent],
      providers: [
        { provide: NotesFacade, useValue: mockNotesFacade },
        {
          provide: RemoveNotesGroupDialogService,
          useValue: mockRemoveNotesGroupDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.groupToRemove = {
      id: '1',
      name: 'Test Group',
      notes: [],
    } as unknown as NotesGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog on ngAfterViewInit', () => {
    const openSpy = jest.spyOn(component['dialog'], 'open');
    component.ngAfterViewInit();
    expect(openSpy).toHaveBeenCalledWith(component['dialogContent']);
  });

  it('should handle remove correctly', () => {
    component.handleRemove();
    expect(mockNotesFacade.removeNotesGroup).toHaveBeenCalledWith('1');
  });
});
