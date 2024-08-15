import { OperationState } from '@jhh/jhh-client/shared/domain';

export function ResetOperationStateError(
  state: OperationState
): OperationState {
  return { ...state, error: null };
}
