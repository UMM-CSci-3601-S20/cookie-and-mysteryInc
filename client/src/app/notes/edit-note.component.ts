import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Note } from './note';
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
    this.noteService.editNote(this.editNoteForm.value, this.id).subscribe(newID => {
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

}
