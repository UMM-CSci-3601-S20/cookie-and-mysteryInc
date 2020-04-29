import { Component, OnInit, OnDestroy } from '@angular/core';
import { DoorBoardService } from '../doorBoard/doorBoard.service';
import { DoorBoard } from '../doorBoard/doorBoard';
import { NgModule } from '@angular/core';
import { Note, NewNote } from './note';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { NoteService } from './note.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favorite-component',
  templateUrl: 'favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
  providers: []
})

export class FavoriteComponent implements OnInit, OnDestroy {

  public serverFilteredNotes: Note[];
  public favorite: boolean;
  note: Note;
  id: string;
  body: string;
  getNoteSub: Subscription;

  constructor(private location: Location, private noteService: NoteService,
              private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute ) {

  }

  retrieveNotes(): void {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.getNoteSub) {
      this.getNoteSub.unsubscribe();
  }
}
}
