import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Note, NoteStatus, NewNote, SaveNote } from './note';

@Injectable()
export class NoteService {
  readonly noteUrl: string = environment.API_URL + 'notes';
  @Input() isExpired = false;
  @Input() isPinned = false;
  constructor(private httpClient: HttpClient) {}


  /**
   *
   * @param doorBoardID: _id of the doorBoard
   * whose notes are being retrieved.
   *
   * @returns a list of the notes belonging to this doorBoard, filtered by body and status
   *
   */
  getNotesByDoorBoard(doorBoardID: string, filters?: { body?: string , status?: NoteStatus}): Observable<Note[]> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('doorBoardID', doorBoardID);  // Ensure we are getting notes belonging to this doorBoard
    if (filters) {
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status);
      }

    }
    return this.httpClient.get<Note[]>(this.noteUrl, {
      params: httpParams,
    });
  }

  getFavoriteNotes(doorBoardID: string, filters?: { favorite?: boolean}): Observable<Note[]> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('doorBoardID', doorBoardID);  // Ensure we are getting notes belonging to this doorBoard
    if (filters) {
      if (filters.favorite) {
        httpParams = httpParams.set('favorite', filters.favorite.toString());
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
  filterNotes(notes: Note[], filters: { addDate?: Date, expireDate?: Date, favorite?: boolean, isExpired?: boolean,
     isPinned?: boolean } ): Note[] {

    let filteredNotes = notes;

    if (filters.favorite === true) {
      console.log('favorite notes');

      filteredNotes = filteredNotes.filter(note => {
        return note.favorite === filters.favorite;
      });
    }

    if (filters.isPinned === false && filters.isExpired === false) {
        console.log('expired notes');

        filteredNotes = filteredNotes.filter(note => {
        return note.isPinned === filters.isPinned;
      });
    }

    if (filters.isPinned === true) {
    filteredNotes = filteredNotes.filter(note => {
        return note.isPinned === filters.isPinned;
    })}
    return filteredNotes;
  }




  addNewNote(newNote: NewNote): Observable<string> {
    console.log('Got to addNewNote in note.service.ts ');
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

  editNote(editNote: Note, id: string): Observable<string> {
    return this.httpClient.post<{id: string}>(this.noteUrl + '/edit/' + id, editNote).pipe(map(res => res.id));
  }

  repostNote(repostNote: Note, id: string): Observable<string> {
    return this.httpClient.post<{id: string}>(this.noteUrl + '/repost/' + id, repostNote).pipe(map(res => res.id));
  }

  pinNote(pinNote: Note, id: string): Observable<string> {
    return this.httpClient.post<{id: string}>(this.noteUrl + '/pin/' + id, pinNote).pipe(map(res => res.id));
  }

  getNoteById(id: string): Observable<Note> {
    return this.httpClient.get<Note>(this.noteUrl + '/' + id);
  }

  favoriteNote(favoriteNote: Note, id: string): Observable<string> {
    return this.httpClient.post<{id: string}>(this.noteUrl + '/' + id + '/favorite', favoriteNote).pipe(map(res => res.id));
  }

  unfavoriteNote(unfavoriteNote: Note, id: string): Observable<string> {
    return this.httpClient.post<{id: string}>(this.noteUrl + '/' + id + '/unfavorite', unfavoriteNote).pipe(map(res => res.id));
  }

  changeIsExpiredField(isExpired: Note, id: string): Observable<string> {
    console.log(id);
    console.log('Got to Note.service.ts');
    return this.httpClient.post<{id: string}>(this.noteUrl + '/' + id + '/changeIsExpiredField', isExpired).pipe(map(res => res.id));
  }

}
