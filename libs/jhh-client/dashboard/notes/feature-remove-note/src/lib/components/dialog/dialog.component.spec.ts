import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RemoveNoteDialogService } from '../../services/remove-note-dialog.service';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { DialogComponent } from './dialog.component';

import { Note } from '@jhh/shared/domain';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockNotesFacade: jest.Mocked<NotesFacade>, mockRemoveNoteDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      removeNoteInProgress$: of(false),
      removeNoteError$: of(null),
      removeNote: jest.fn(),
    } as unknown as jest.Mocked<NotesFacade>;
    mockRemoveNoteDialogService = {
      clearNoteToRemove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, DialogComponent],
      providers: [
        { provide: NotesFacade, useValue: mockNotesFacade },
        {
          provide: RemoveNoteDialogService,
          useValue: mockRemoveNoteDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.noteToRemove = {
      id: '1',
      name: 'Test Note',
    } as unknown as Note;
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
    expect(mockNotesFacade.removeNote).toHaveBeenCalledWith('1');
  });
});
