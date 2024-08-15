import { TestBed } from '@angular/core/testing';

import { ChangeNoteGroupDialogService } from './change-note-group-dialog.service';

import { Note } from '@jhh/shared/domain';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('ChangeNoteGroupDialogService', () => {
  let service: ChangeNoteGroupDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeNoteGroupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a note when openDialog is called', (done) => {
    const mockNote = {
      id: '123',
      name: 'Test Note',
      content: 'Test Content',
    } as Note;
    service.noteToMove$.subscribe((note) => {
      expect(note).toEqual(mockNote);
      done();
    });

    service.openDialog(mockNote);
  });

  it('should emit undefined when clearNoteToMove is called', (done) => {
    service.noteToMove$.subscribe((note) => {
      expect(note).toBeUndefined();
      done();
    });

    service.clearNoteToMove();
  });
});
