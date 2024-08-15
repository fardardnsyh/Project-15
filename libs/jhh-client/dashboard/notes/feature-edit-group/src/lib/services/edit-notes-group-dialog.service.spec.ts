import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { EditNotesGroupDialogService } from './edit-notes-group-dialog.service';

import { NotesGroup } from '@jhh/shared/domain';

describe('EditNotesGroupDialogService', () => {
  let service: EditNotesGroupDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    service = new EditNotesGroupDialogService();
  });

  it('should emit the correct NotesGroup when openDialog is called', (done) => {
    const testNotesGroup: NotesGroup = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'name',
      slug: 'slug',
      notes: [],
    };

    service.notesGroupToEdit$.subscribe((value) => {
      expect(value).toEqual(testNotesGroup);
      done();
    });

    service.openDialog(testNotesGroup);
  });

  it('should emit undefined when clearNotesGroupToEdit is called', (done) => {
    service.notesGroupToEdit$.subscribe((value) => {
      expect(value).toBeUndefined();
      done();
    });

    service.clearNotesGroupToEdit();
  });
});
