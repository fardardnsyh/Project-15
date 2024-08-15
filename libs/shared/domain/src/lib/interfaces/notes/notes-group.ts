import { Note } from './note';

export interface NotesGroup {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  notes: Note[];
}
