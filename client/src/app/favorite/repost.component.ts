import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Note, NewNote } from '../notes/note';
import { NoteService } from '../notes/note.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';
import { DoorBoardService } from '../doorBoard/doorBoard.service';

@Component({
  selector: 'app-repost-component',
  templateUrl: 'repost.component.html',
  styleUrls: ['repost.component.scss'],
})
export class RepostNoteComponent implements OnInit {

  repostNoteForm: FormGroup;
  doorBoard_id: string;
  note: Note;
  id: string;
  body: string;
  getNoteSub: Subscription;
// vars for expirations
  min: Date; // Earliest allowed date to be selected
  max: Date; // lasted date allowed to be selected
  selectedTime: string;

  constructor(private fb: FormBuilder, private _location: Location, private noteService: NoteService,
              private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {
  }

  repostNoteValidationMessages = {
    body: [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body cannot be more than 300 characters long'}
    ]
  };

  createForms() {

    // repost note form validations
    this.repostNoteForm = this.fb.group({
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(300),
      ])),
      expiration: new FormControl('', Validators.compose([
      ])),
    });

  }

   ngOnInit() {
    this.createForms();
    this.min = new Date();
    this.max = new Date(new Date().setFullYear(this.min.getFullYear() + 5));
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getNoteSub) {
        this.getNoteSub.unsubscribe();
      }
      console.log('The note id is = ' + this.id);
      this.getNoteSub = this.noteService.getNoteById(this.id).subscribe((retrievedNote: Note) => {
        console.log('The retrieved note is = ' + retrievedNote);
        this.repostNoteForm.get('body').setValue(retrievedNote.body);
      });
    });
  }

  submitForm() {
    const noteToRepost: Note = this.repostNoteForm.value;
    const currentDate = new Date();
    const newDate = new Date(currentDate.setHours(currentDate.getHours() + 5)); // open to change to what is needed


    if (noteToRepost.expiration === '') {
      this.selectedTime = newDate.toJSON();
    } else {
      this.selectedTime = noteToRepost.expiration;
      console.log('The selected expire date is: ' + this.selectedTime);
      this.selectedTime = this.convertToIsoDate(this.selectedTime);
    }

    noteToRepost.expiration = this.selectedTime;
    noteToRepost.isExpired = false;
    //noteToRepost.favorite = false;
    this.noteService.repostNote(noteToRepost, this.id).subscribe(newID => {
      this.snackBar.open('Successfully reposted note', null, {
        duration: 2000,
      });
      this._location.back();
    }, err => {
      this.snackBar.open('Failed to repost the note', null, {
        duration: 2000,
      });
      this.router.navigate(['/doorBoards/' + this.doorBoard_id ])
    });
  }

  ngOnDestroy(): void {
    if (this.getNoteSub) {
      this.getNoteSub.unsubscribe();
    }
  }
  convertToIsoDate(selectedDate: string): string {
    const tryDate = new Date(selectedDate);
    return tryDate.toISOString();
  }
}
