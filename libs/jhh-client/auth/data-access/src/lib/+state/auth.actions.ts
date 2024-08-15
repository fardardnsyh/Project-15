import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import {
  LoginPayload,
  LoginSuccessPayload,
  RegisterPayload,
  RegisterSuccessPayload,
  SaveTokenPayload,
} from '@jhh/jhh-client/auth/domain';
import { User } from '@jhh/shared/domain';

export enum Type {
  SetUser = '[Auth] Set User',
  Login = '[Auth] Login',
  LoginFail = '[Auth] Login Fail',
  LoginSuccess = '[Auth] Login Success',
  ResetLoginSuccess = '[Auth] Reset Login Success',
  Register = '[Auth] Register',
  RegisterFail = '[Auth] Register Fail',
  RegisterSuccess = '[Auth] Register Success',
  ResetRegisterSuccess = '[Auth] Reset Register Success',
  RemoveAccount = '[Auth] Remove Account',
  RemoveAccountFail = '[Auth] Remove Account Fail',
  RemoveAccountSuccess = '[Auth] Remove Account Success',
  SaveToken = '[Auth] Save Token',
  Logout = '[Auth] Logout',
}

export const setUser = createAction(Type.SetUser, props<{ user: User }>());

export const login = createAction(
  Type.Login,
  props<{ payload: LoginPayload }>()
);

export const loginFail = createAction(
  Type.LoginFail,
  props<{ payload: HttpErrorResponse }>()
);

export const loginSuccess = createAction(
  Type.LoginSuccess,
  props<{ payload: LoginSuccessPayload }>()
);

export const resetLoginSuccess = createAction(Type.ResetLoginSuccess);

export const register = createAction(
  Type.Register,
  props<{ payload: RegisterPayload }>()
);

export const registerFail = createAction(
  Type.RegisterFail,
  props<{ payload: HttpErrorResponse }>()
);

export const registerSuccess = createAction(
  Type.RegisterSuccess,
  props<{ payload: RegisterSuccessPayload }>()
);

export const resetRegisterSuccess = createAction(Type.ResetRegisterSuccess);

export const removeAccount = createAction(Type.RemoveAccount);

export const removeAccountFail = createAction(
  Type.RemoveAccountFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeAccountSuccess = createAction(Type.RemoveAccountSuccess);

export const saveToken = createAction(
  Type.SaveToken,
  props<{ payload: SaveTokenPayload }>()
);

export const logout = createAction(Type.Logout);
