import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BoardService } from './board.service';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/domain';
import {
  DuplicateBoardColumnPayload,
  UpdateBoardColumnsPayload,
} from '@jhh/jhh-client/dashboard/board/domain';

describe('BoardService', () => {
  let service: BoardService;
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
      providers: [BoardService],
    });
    service = TestBed.inject(BoardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a board column', () => {
    const mockPayload = { name: 'Test Column', color: '#FF0000' };
    const mockResponse = {
      data: { columnId: '123', name: 'Test Column', color: '#FF0000' },
    };

    service.addBoardColumn(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.AddBoardColumn}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should edit a board column', () => {
    const mockPayload = {
      columnId: '123',
      name: 'Updated Column',
      color: '#00FF00',
    };
    const mockResponse = {
      data: { columnId: '123', name: 'Updated Column', color: '#00FF00' },
    };

    service.editBoardColumn(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.EditBoardColumn}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should duplicate a board column', () => {
    const mockPayload = {
      columnId: '123',
      items: [{ content: 'Task 1' }],
    } as DuplicateBoardColumnPayload;
    const mockResponse = {
      data: {
        duplicatedColumnId: '124',
        name: 'Duplicated Column',
        color: '#00FF00',
        items: [{ content: 'Task 1' }],
      },
    };

    service.duplicateBoardColumn(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.DuplicateBoardColumn}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should remove a board column', () => {
    const mockPayload = { columnId: '123' };
    const mockResponse = { data: { message: 'Column removed successfully' } };

    service.removeBoardColumn(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.RemoveBoardColumn}?columnId=${mockPayload.columnId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should update board columns', () => {
    const mockPayload = {
      columnsToUpdate: [
        { columnId: '123', order: 2, items: [{ content: 'Updated Task' }] },
      ],
      removedItemIds: ['456'],
      unsavedBoardRequestId: null,
    } as unknown as UpdateBoardColumnsPayload;
    const mockResponse = {
      data: { updatedColumns: [{ columnId: '123', order: 2 }] },
    };

    service.updateBoardColumns(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.UpdateBoardColumns}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });
});
