import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteService } from '../notes/note.service';
import { Note } from './note';
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
  @Input() note: Note;
  @Input() simple ? = false;
  content: any;
  isClicked = false;
  @Input() confirmIcon = false;
  constructor(private route: ActivatedRoute, private  noteService: NoteService) { }

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

  pinNote(): void {
    this.noteService.pinNote(this.note, this.note._id).subscribe(result => {
      console.log('Note pin changed')
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
