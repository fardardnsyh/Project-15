import { OfferStatus } from '@jhh/shared/domain';

enum StatusIcon {
  Drafts = 'drafts',
  AssignmentReturned = 'assignment_returned',
  Timelapse = 'timelapse',
  Work = 'work',
  CheckCircle = 'check_circle',
  Cancel = 'cancel',
}

export const statusIconMap: { [key in OfferStatus]: StatusIcon } = {
  [OfferStatus.NotApplied]: StatusIcon.Drafts,
  [OfferStatus.Applied]: StatusIcon.AssignmentReturned,
  [OfferStatus.Interviewing]: StatusIcon.Timelapse,
  [OfferStatus.OfferReceived]: StatusIcon.Work,
  [OfferStatus.Accepted]: StatusIcon.CheckCircle,
  [OfferStatus.Rejected]: StatusIcon.Cancel,
};

export function GetOfferStatusIcon(status: OfferStatus): StatusIcon {
  return statusIconMap[status];
}
