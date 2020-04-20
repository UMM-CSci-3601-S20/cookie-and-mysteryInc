import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Note, NoteStatus, NewNote } from './note';

@Injectable()
export class NoteService {
  readonly noteUrl: string = environment.API_URL + 'notes';

  constructor(private httpClient: HttpClient) {}


  /**
   *
   * @param doorBoardID: _id of the doorBoard
   * whose notes are being retrieved.
   *
   * @returns a list of the notes belonging to this doorBoard, filtered by body and status
   *
   */
  getNotesByDoorBoard(doorBoardID: string, filters?: { body?: string, status?: NoteStatus }): Observable<Note[]> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('doorBoardID', doorBoardID);  // Ensure we are getting notes belonging to this doorBoard
    if (filters) {
      if (filters.body) {
        httpParams = httpParams.set('body', filters.body);
      }
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status);
      }
    }
    return this.httpClient.get<Note[]>(this.noteUrl, {
      params: httpParams,
    });
  }

  /**
   *
   * @param notes: the list of notes being filtered
   * @param filters: filtering by `addDate` and `expireDate`
   */
  filterNotes(notes: Note[], filters: { addDate?: Date, expireDate?: Date } ): Note[] {

    let filteredNotes = notes;

   /* // Filter by addDate
    if (filters.addDate.toISOString()) {
      filteredNotes = filteredNotes.filter(note => {
        return note.addDate.indexOf(filters.addDate) !== -1;
      });
    }
    // Filter by expireDate
    if (filters.expireDate) {
      filteredNotes = filteredNotes.filter(note => {
        return note.expireDate.toISOString().indexOf(filters.expireDate.toISOString()) !== -1;
      });
    }
*/
    return filteredNotes;
  }

  addNewNote(newNote: NewNote): Observable<string> {
    // Send a post request to add a new note with the note data as the body.
    // const test = this.httpClient.post<{id: string}>(this.noteUrl + '/new', newNote).pipe(map(res => res.id));
    return this.httpClient.post<{id: string}>(this.noteUrl + '/new', newNote).pipe(map(res => res.id));
  }

  // To implement
  // deleteNote()
  // editNote()

  // n.b. the server http redirection and serverside implementation of these features are complete.
  // howere, deleteNote() is untested.

  deleteNote(id: string): Observable<string> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('doorBoardID', id);
    console.log('NOTE SERVICE CALLED');
    return this.httpClient.delete<string>(this.noteUrl + '/' + id);
  }

}
