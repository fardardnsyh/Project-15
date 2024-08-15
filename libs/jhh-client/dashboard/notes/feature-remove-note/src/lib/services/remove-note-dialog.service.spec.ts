import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RemoveNoteDialogService } from './remove-note-dialog.service';

import { Note } from '@jhh/shared/domain';

describe('RemoveNoteDialogService', () => {
  let service: RemoveNoteDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveNoteDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit note when openDialog is called', (done) => {
    const mockNote: Note = {
      id: '1',
      name: 'Test note',
    } as unknown as Note;
    service.noteToRemove$.pipe(take(1)).subscribe((note) => {
      expect(note).toEqual(mockNote);
      done();
    });

    service.openDialog(mockNote);
  });

  it('should clear note when clearNoteToRemove is called', (done) => {
    service.noteToRemove$.pipe(take(1)).subscribe((note) => {
      expect(note).toBeUndefined();
      done();
    });

    service.clearNoteToRemove();
  });
});
