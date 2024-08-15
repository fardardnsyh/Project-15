import { User } from '@jhh/shared/domain';

export interface LoginSuccessPayload {
  token: string;
  user: User;
}
