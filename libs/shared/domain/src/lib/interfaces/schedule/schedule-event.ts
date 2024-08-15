export interface ScheduleEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  start: Date;
  end: Date;
  title: string;
  color: string;
  description?: string;
}
