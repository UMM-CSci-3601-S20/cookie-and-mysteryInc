
/**
 * When we create a new note, not all of the fields exist yet. Some of
 * them are left for the server to fill in.
 */
export interface NewNote {
  doorBoardID: string;
  body: string;
  expiration: string;
  status: NoteStatus;
}

export interface Note extends NewNote {
  favorite: boolean;
  _id: string;
  addDate: Date;
}

export interface SaveNote extends NewNote, Note  {
  isExpired: boolean;
  favorite: boolean;
}

export type NoteStatus = 'active' | 'template' | 'draft' | 'deleted';
