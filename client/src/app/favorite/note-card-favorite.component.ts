import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteService } from '../notes/note.service';
import { Note } from '../notes/note';
import { ActivatedRoute } from '@angular/router';

// this is a template for a single note essentially
@Component({
  selector: 'app-note-card-favorite',
  templateUrl: './note-card-favorite.component.html',
  styleUrls: ['./note-card-favorite.component.scss']
})


export class NoteCardFavoriteComponent implements OnInit, OnDestroy {
  getNotesSub: Subscription;
  id: string;
  @Input() note: Note;
  @Input() simple ? = false;
  @Input() confirmIsExpired = false;
  confirmDelete = false;

  constructor(private route: ActivatedRoute, private noteService: NoteService) { }

  deleteNoteFromServer(): void {
    this.getNotesSub = this.noteService.deleteNote(this.note._id).subscribe( deleted => {
      console.log('Note deleted');
    }, err => {
        console.log(err);
      }

    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
