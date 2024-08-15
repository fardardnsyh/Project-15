export interface EditEventPayload {
  eventId: string;
  start: Date;
  end: Date;
  title: string;
  color: string;
  description?: string;
}
