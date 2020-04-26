import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Note, NewNote } from './note';
import { NoteService } from './note.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-note-component',
  templateUrl: 'edit-note.component.html',
  styleUrls: ['edit-note.component.scss'],
})
export class EditNoteComponent implements OnInit {

  editNoteForm: FormGroup;

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

  editNoteValidationMessages = {
    body: [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body cannot be more than 300 characters long'}
    ]
  };

  createForms() {

    // edit note form validations
    this.editNoteForm = this.fb.group({
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
        this.editNoteForm.get('body').setValue(retrievedNote.body);
      });
    });
  }

  submitForm() {
    const noteToEdit: Note = this.editNoteForm.value;
    const currentDate = new Date();
    const newDate = new Date(currentDate.setHours(currentDate.getHours() + 5)); // open to change to what is needed


    if (noteToEdit.expiration === '') {
      this.selectedTime = newDate.toJSON();
    } else {
      this.selectedTime = noteToEdit.expiration;
      console.log('The selected expire date is: ' + this.selectedTime);
      this.selectedTime = this.convertToIsoDate(this.selectedTime);
    }

    noteToEdit.expiration = this.selectedTime;
    this.noteService.editNote(noteToEdit, this.id).subscribe(newID => {
      this.snackBar.open('Successfully edited note', null, {
        duration: 2000,
      });
      this._location.back();
    }, err => {
      this.snackBar.open('Failed to edit the note', null, {
        duration: 2000,
      });
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
