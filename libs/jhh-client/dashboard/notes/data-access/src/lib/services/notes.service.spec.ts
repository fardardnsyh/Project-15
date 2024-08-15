import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { environment } from '@jhh/jhh-client/shared/config';

import { NotesService } from './notes.service';

import { ApiRoute } from '@jhh/shared/domain';
import { DuplicateNotesGroupPayload } from '@jhh/jhh-client/dashboard/notes/domain';
import { DuplicateBoardColumnSuccessPayload } from '@jhh/jhh-client/dashboard/board/domain';

describe('NotesService', () => {
  let service: NotesService;
  let httpTestingController: HttpTestingController;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotesService],
    });
    service = TestBed.inject(NotesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add a notes group', () => {
    const mockPayload = { name: 'Test Group' };
    const mockResponse = { data: { groupId: '123', name: 'Test Group' } };

    service.addNotesGroup(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.AddNotesGroup
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should edit a notes group', () => {
    const mockPayload = { groupId: '123', name: 'New Name', slug: 'new-name' };
    const mockResponse = { data: mockPayload };

    service.editNotesGroup(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.EditNotesGroup
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should duplicate a notes group', () => {
    const mockPayload: DuplicateNotesGroupPayload = { groupId: '123' };
    const mockResponse = {
      duplicatedGroupId: '456',
      name: 'Duplicated Group',
    } as unknown as DuplicateBoardColumnSuccessPayload;

    service.duplicateNotesGroup(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.DuplicateNotesGroup}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ groupId: mockPayload.groupId });
    req.flush({ data: mockResponse });
  });

  it('should remove a notes group', () => {
    const mockPayload = { groupId: '123' };
    const mockResponse = { data: { message: 'Group removed' } };

    service.removeNotesGroup(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      (request) =>
        request.url ===
          environment.apiUrl +
            ApiRoute.BaseProtected +
            ApiRoute.RemoveNotesGroup && request.params.get('groupId') === '123'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should add a note', () => {
    const mockPayload = {
      name: 'New Note',
      content: 'Content',
      groupId: '123',
    };
    const mockResponse = { data: { noteId: '456', ...mockPayload } };

    service.addNote(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.AddNote
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should edit a note', () => {
    const mockPayload = {
      noteId: '123',
      name: 'Edited Note',
      slug: 'edited-note',
      content: 'New Content',
      groupId: '123',
    };
    const mockResponse = { data: { ...mockPayload } };

    service.editNote(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.EditNote
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should duplicate a note', () => {
    const mockPayload = { noteId: '123', groupId: '456' };
    const mockResponse = { data: { noteId: 'new123', groupId: '456' } };

    service.duplicateNote(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.DuplicateNote
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should change a note group', () => {
    const mockPayload = { noteId: '123', newGroupId: '456' };
    const mockResponse = { data: { noteId: '123', groupId: '456' } };

    service.changeNoteGroup(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.ChangeNoteGroup
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should remove a note', () => {
    const mockPayload = { noteId: '123' };
    const mockResponse = { data: { noteId: '123', message: 'Note removed' } };

    service.removeNote(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      (request) =>
        request.url ===
          environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.RemoveNote &&
        request.params.get('noteId') === '123'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
