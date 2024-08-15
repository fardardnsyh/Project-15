import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from './auth.service';

import { ApiRoute, LocalStorageKey, User } from '@jhh/shared/domain';

import { environment } from '@jhh/jhh-client/shared/config';

import {
  LoginPayload,
  LoginSuccessResponse,
  RegisterPayload,
  RegisterSuccessResponse,
  RemoveAccountSuccessResponse,
} from '@jhh/jhh-client/auth/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { Router } from '@angular/router';

const dummyUser: User = {
  id: '1337',
  createdAt: new Date(),
  username: 'john',
};

const TOKEN: string = 'some-token';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const reloadMock = jest.fn();

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  Object.defineProperty(window, 'location', {
    value: {
      reload: reloadMock,
    },
    writable: true,
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [AuthService, MatDialog],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    reloadMock.mockClear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return a LoginSuccessPayload containing a token and user details when called with a valid LoginPayload', () => {
      const dummyPayload: LoginPayload = {
        username: dummyUser.username,
        password: 'password',
      };
      const dummyResponse: LoginSuccessResponse = {
        data: {
          token: TOKEN,
          user: dummyUser,
        },
      };

      service.login(dummyPayload).subscribe((res) => {
        expect(res).toEqual(dummyResponse.data);
      });

      const req: TestRequest = httpMock.expectOne(
        `${environment.apiUrl}${ApiRoute.BaseUser}${ApiRoute.Login}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(dummyResponse);
    });
  });

  describe('register', () => {
    it('should return a RegisterSuccessPayload containing a token and user details when called with a valid RegisterPayload', () => {
      const dummyPayload: RegisterPayload = {
        username: dummyUser.username,
        password: 'password',
        confirmPassword: 'password',
      };
      const dummyResponse: RegisterSuccessResponse = {
        data: {
          token: TOKEN,
          user: dummyUser,
        },
      };

      service.register(dummyPayload).subscribe((res) => {
        expect(res).toEqual(dummyResponse.data);
      });

      const req: TestRequest = httpMock.expectOne(
        `${environment.apiUrl}${ApiRoute.BaseUser}${ApiRoute.Register}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(dummyResponse);
    });
  });

  describe('Token Management', () => {
    it('should save token', () => {
      service.saveToken(TOKEN);
      expect(
        JSON.parse(localStorage.getItem(LocalStorageKey.Token) as string)
      ).toBe(TOKEN);
    });

    it('should get token', () => {
      localStorage.setItem(LocalStorageKey.Token, JSON.stringify(TOKEN));
      expect(service.getToken()).toBe(TOKEN);
    });

    it('should remove token', () => {
      localStorage.setItem(LocalStorageKey.Token, JSON.stringify(TOKEN));
      service.removeToken();
      expect(localStorage.getItem(LocalStorageKey.Token)).toBeNull();
    });

    it('should close all dialogs, navigate to login, and reload the page', () => {
      const dialogSpy = jest.spyOn(TestBed.inject(MatDialog), 'closeAll');
      const mockRouter = TestBed.inject(Router);
      jest.spyOn(mockRouter, 'navigate');

      service.removeToken();

      expect(localStorage.getItem(LocalStorageKey.Token)).toBeNull();
      expect(dialogSpy).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith([ClientRoute.LoginLink]);
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  describe('removeAccount', () => {
    it('should make a DELETE request and return the expected response', () => {
      const dummyResponse: RemoveAccountSuccessResponse = {
        data: { removedAccountId: '1337' },
      };

      service.removeAccount().subscribe((res) => {
        expect(res).toEqual(dummyResponse.data);
      });

      const req: TestRequest = httpMock.expectOne(
        `${environment.apiUrl}${ApiRoute.BaseUser}${ApiRoute.RemoveAccount}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(dummyResponse);
    });
  });
});
