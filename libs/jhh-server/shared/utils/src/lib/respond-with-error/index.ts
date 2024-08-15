import { Response } from 'express';

import { HttpStatusCode } from '@jhh/shared/domain';

export function respondWithError(
  res: Response,
  code: HttpStatusCode,
  message: string
): void {
  res.status(code).json({ message: message });
  return;
}
