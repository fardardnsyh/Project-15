import { GetOfferStatusIcon, statusIconMap } from '.';
import { OfferStatus } from '@jhh/shared/domain';

describe('GetOfferStatusIcon Dynamic Test', () => {
  Object.entries(statusIconMap).forEach(([status, expectedIcon]) => {
    it(`should return ${expectedIcon} for ${status} status`, () => {
      expect(GetOfferStatusIcon(status as OfferStatus)).toBe(expectedIcon);
    });
  });
});
