import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DoorBoardService } from '../doorBoard/doorBoard.service';
import { DoorBoard } from '../doorBoard/doorBoard';
import { NgModule } from '@angular/core';
import { Note, NewNote, SaveNote, NoteStatus } from '../notes/note';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { NoteService } from '../notes/note.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-favorite-component',
  templateUrl: 'favorite.component.html',
  styleUrls: ['favorite.component.scss'],
  providers: []
})

export class FavoriteComponent implements OnInit, OnDestroy {

  public serverFilteredNotes: Note[];
  public favorite: boolean;
  public notes: Note[];
  id: string;
  body: string;
  getNotesSub: Subscription;
  noteStatus: NoteStatus;
  noteBody: string;
  getDoorBoardSub: any;
  doorBoard: DoorBoard;
  public filteredNotes: Note[];
  public favoritedNotes: Note[];
  noteAddDate: Date;
  noteExpireDate: Date;
  @Input() confirmIsExpired = false;

  constructor(private doorBoardService: DoorBoardService, private location: Location, private noteService: NoteService,
              private router: Router, private route: ActivatedRoute ) {

  }

  public getNotesFromServer(): void {
    this.unsub();
    this.getNotesSub = this.noteService.getFavoriteNotes(
      this.id,{
        favorite: this.favorite,
        // status: this.noteStatus,
        // body: this.noteBody
      }).subscribe(returnedNotes => {
        this.serverFilteredNotes = returnedNotes;
        this.updateFilter();
      }, err => {
        console.log(err);
      });
  }

  public updateFilter(): void {
    this.filteredNotes = this.noteService.filterNotes(
      this.serverFilteredNotes,
      {
        favorite: false
      });
    this.favoritedNotes = this.noteService.filterNotes(
      this.serverFilteredNotes,
      {
        favorite: true
      });
  }

  retrieveNotes(): void {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getNotesSub) {
        this.getNotesSub.unsubscribe();
      }
      this.getNotesSub = this.noteService.getNotesByDoorBoard(this.id).subscribe( notes => this.notes = notes);
      this.getNotesFromServer();
      if (this.getDoorBoardSub) {
        this.getDoorBoardSub.unsubscribe();
      }
      this.getDoorBoardSub = this.doorBoardService.getDoorBoardById(this.id).subscribe( async (doorBoard: DoorBoard) => {
      this.doorBoard = doorBoard;
    });
  });
  }

  ngOnDestroy() {
    if (this.getNotesSub) {
      this.getNotesSub.unsubscribe();
  }
}

unsub(): void {
  if (this.getNotesSub) {
    this.getNotesSub.unsubscribe();
  }

  if (this.getDoorBoardSub) {
    this.getDoorBoardSub.unsubscribe();
  }
}
}
