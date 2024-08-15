import { OfferStatus } from '@jhh/shared/domain';

export interface OfferStatusUpdate {
  date: Date;
  status: OfferStatus;
}
