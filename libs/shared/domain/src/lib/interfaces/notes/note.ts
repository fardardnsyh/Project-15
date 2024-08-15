export interface Note {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  content: string;
  groupId: string;
}
