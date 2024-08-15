import { Response } from 'express';

// @ts-ignore
import { HttpStatusCode } from '@jhh/shared/domain';

import { respondWithError } from '.';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('respondWithError function', () => {
  it('should set the response status and JSON message correctly', () => {
    const res = mockResponse();
    const code = HttpStatusCode.BadRequest;
    const message = 'An error occurred';

    respondWithError(res, code, message);

    expect(res.status).toHaveBeenCalledWith(code);
    expect(res.json).toHaveBeenCalledWith({ message });
  });
});
