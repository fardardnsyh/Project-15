import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

import { OfferStatusUpdate } from './offer-status-update';

export interface Offer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  statusUpdates: OfferStatusUpdate[];
  position: string;
  slug: string;
  link: string;
  company: string;
  companyType: OfferCompanyType;
  location: OfferLocation;
  status: OfferStatus;
  priority: OfferPriority;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: OfferSalaryCurrency;
  email?: string;
  description?: string;
}
