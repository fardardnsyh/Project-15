import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

export interface AddOfferPayload {
  position: string;
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
