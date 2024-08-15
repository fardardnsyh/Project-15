import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RemoveNotesGroupDialogService } from './remove-notes-group-dialog.service';

import { NotesGroup } from '@jhh/shared/domain';

describe('RemoveNotesGroupDialogService', () => {
  let service: RemoveNotesGroupDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveNotesGroupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit notes group when openDialog is called', (done) => {
    const mockNotesGroup: NotesGroup = {
      id: '1',
      name: 'Test Group',
      notes: [],
    } as unknown as NotesGroup;
    service.notesGroupToRemove$.pipe(take(1)).subscribe((group) => {
      expect(group).toEqual(mockNotesGroup);
      done();
    });

    service.openDialog(mockNotesGroup);
  });

  it('should clear notes group when clearNotesGroupToRemove is called', (done) => {
    service.notesGroupToRemove$.pipe(take(1)).subscribe((group) => {
      expect(group).toBeUndefined();
      done();
    });

    service.clearNotesGroupToRemove();
  });
});
