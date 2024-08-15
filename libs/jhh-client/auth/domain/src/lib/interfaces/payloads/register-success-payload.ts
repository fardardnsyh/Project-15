import { User } from '@jhh/shared/domain';

export interface RegisterSuccessPayload {
  token: string;
  user: User;
}
