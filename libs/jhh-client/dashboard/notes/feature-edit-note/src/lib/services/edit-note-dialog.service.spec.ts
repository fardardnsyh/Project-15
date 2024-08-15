import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { Note } from '@jhh/shared/domain';

import { EditNoteDialogService } from './edit-note-dialog.service';

describe('EditNoteDialogService', () => {
  let service: EditNoteDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    service = new EditNoteDialogService();
  });

  it('should emit the correct Note when openDialog is called', (done) => {
    const testNote: Note = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'note',
      slug: 'note-slug',
      content: '',
      groupId: '2',
    };

    service.noteToEdit$.subscribe((value) => {
      expect(value).toEqual(testNote);
      done();
    });

    service.openDialog(testNote);
  });

  it('should emit undefined when clearNoteToEdit is called', (done) => {
    service.noteToEdit$.subscribe((value) => {
      expect(value).toBeUndefined();
      done();
    });

    service.clearNoteToEdit();
  });
});
