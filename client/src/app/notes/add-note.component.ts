import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NewNote } from './note';
import { NoteService } from './note.service';
import { DoorBoardService } from '../doorBoard/doorBoard.service';
import { DoorBoard } from '../doorBoard/doorBoard';
import { NgModule } from '@angular/core';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

@NgModule({
  providers: [
    // use french locale
    {provide: OWL_DATE_TIME_LOCALE, useValue: LOCALE_ID},
  ],
})



@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: [ ]
})
export class AddNoteComponent implements OnInit {

  // Not necessary, apparently?
  // tslint:disable-next-line: no-input-rename
  // @Input('cdkTextareaAutosize')
  // enabled = true;

  doorBoard_id: string;
  @ViewChild('bodyInput') bodyInput: ElementRef;

  addNoteForm: FormGroup;
  @Output() newNoteAdded = new EventEmitter();
  constructor(private fb: FormBuilder, private noteService: NoteService,
              private snackBar: MatSnackBar, private router: Router,
              private doorBoardService: DoorBoardService, private route: ActivatedRoute) {
  }

  @Input() doorBoard: DoorBoard;
  public serverFilteredDoorBoards: DoorBoard[];
  sub: string;
  name: string;
  email: string;
  building: string;
  officeNumber: string;
  status: string;

  min: Date; // Earliest allowed date to be selected
  max: Date; // lasted date allowed to be selected
  selectedTime: string;


  add_note_validation_messages = {
    status: [
      {type: 'required', message: 'Status is required'},
      {type: 'pattern', message: 'Must be active, draft or template'}, // don't want to create a deleted message
    ],

    body: [,
      {type: 'required', message: 'Body is required'},
      {type: 'minLength', message: 'Body must not be empty'},
      {type: 'maxLength', message: 'Cannot exceed 1000 characters'}
    ],

  };


  createForms() {

    // add note form validations
    this.addNoteForm = this.fb.group({
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1000),
      ])),
      expiration: new FormControl('', Validators.compose([
      ])),

    });

  }

  ngOnInit() {
    this.createForms();
    this.route.paramMap.subscribe((pmap) => {
      this.doorBoard_id = pmap.get('id')});
    this.min = new Date();
    this.max = new Date(new Date().setFullYear(this.min.getFullYear() + 5));
  }


  submitForm() {
    // Body.value = '';
    const noteToAdd: NewNote = this.addNoteForm.value;
    noteToAdd.status = 'active';
    const currentDate = new Date();
    const newDate = new Date(currentDate.setHours(currentDate.getHours() + 5)); // open to change to what is needed


    if (noteToAdd.expiration === '') {
      this.selectedTime = newDate.toJSON();
    } else {
      this.selectedTime = noteToAdd.expiration;
      console.log('The selected expire date is: ' + this.selectedTime);
      this.selectedTime = this.convertToIsoDate(this.selectedTime);
    }

    console.log(this.doorBoard_id);
    noteToAdd.doorBoardID = this.doorBoard_id;
    noteToAdd.expiration = this.selectedTime;
    console.log("New note =" + JSON.stringify(noteToAdd));
    this.noteService.addNewNote(noteToAdd).subscribe(newID => {
      // Notify the DoorBoard component that a note has been added.
      this.newNoteAdded.emit();
      // Clear input form
      this.bodyInput.nativeElement.value = '';
      this.snackBar.open('Added Note ', null, {
        duration: 2000,
      });
      // after submission, navigate back to the owner's doorboard
      this.router.navigate(['/doorBoards/' + this.doorBoard_id ]);
    }, err => {
      this.snackBar.open('Failed to add the note', null, {
        duration: 2000,
      });
    });
  }
  convertToIsoDate(selectedDate: string): string {
    const tryDate = new Date(selectedDate);
    return tryDate.toISOString();
  }

}
