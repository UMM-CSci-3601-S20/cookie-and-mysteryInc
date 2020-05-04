import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteService } from '../notes/note.service';
import { Note, NewNote, SaveNote } from './note';
import { ActivatedRoute } from '@angular/router';
// this is a template for a single note essentially
@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})


export class NoteCardComponent implements OnInit, OnDestroy {
 // This would be in the doorboard component notes: Note[];
  getNotesSub: Subscription;
  //public serverFilteredNotes: Note[];
  id: string;
  favorite: boolean;
  @Input() note: Note;
  @Input() simple ? = false;
  @Input() confirmFavoriteIcon = false;
  @Input() isExpired = false;
  @Input() confirmIsExpired = false;
  confirmIcon: boolean;
  constructor(private route: ActivatedRoute, private noteService: NoteService) { }

  @Input() confirmPinnedIcon = false;
  isClicked = false;
  content: any;
 /* getNotesFromServer(): void {
    //this.getNotesSub = this.noteService.getNotesByDoorBoard( this.id )
    .subscribe(notes =>
      this.serverFilteredNotes
      , err => {
      console.log(err);
    });
  }*/

  deleteNoteFromServer(): void {
    this.getNotesSub = this.noteService.deleteNote(this.note._id).subscribe( deleted => {
      console.log('Note deleted');
      //this.getNotesFromServer();
    }, err => {
        console.log(err);
      }
    );
  }

  favoriteNote(): void {
    this.getNotesSub = this.noteService.favoriteNote(this.note, this.note._id).subscribe ();
    console.log(this.note.favorite);
  }

  unfavoriteNote(): void {
    this.getNotesSub = this.noteService.unfavoriteNote(this.note, this.note._id).subscribe ();
    console.log(this.note.favorite);
  }

  changeIsExpiredField(): void {
    this.getNotesSub = this.noteService.changeIsExpiredField(this.note, this.note._id).subscribe ();
    console.log(this.note.isExpired);
    this.confirmIsExpired = this.isExpired;
    console.log(this.note.isExpired);
  }
  pinNote(): void {
    const currentDate = new Date();
    const newDate = new Date(currentDate.setHours(currentDate.getHours() + 5)); // open to change to what is needed
    if(this.note.isPinned){
      this.note.expiration = newDate.toJSON();
    }
    this.noteService.pinNote(this.note, this.note._id).subscribe(result => {
      console.log('Note pin changed');
    }, err => {
      console.log(err);
    });
  }

  addToSummary(content){
    content.isSelected = true;
}

  ngOnInit(): void {
   // this.getNotesFromServer();
  }

  ngOnDestroy(): void {
  }

}
