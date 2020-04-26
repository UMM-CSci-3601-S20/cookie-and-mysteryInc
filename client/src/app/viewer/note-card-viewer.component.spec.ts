import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockNoteService } from '../../testing/note.service.mock';
import { Note } from '../notes/note';
import { NoteCardViewerComponent } from './note-card-viewer.component';
import { NoteService } from '../notes/note.service';
import { MatIconModule } from '@angular/material/icon';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('NoteCardComponent', () => {
  let noteCard: NoteCardViewerComponent;
  let fixture: ComponentFixture<NoteCardViewerComponent>;
  let testNote: Note = {
    _id: 'test_id',
    doorBoardID: 'doorboard',
    body: 'Filler text',
    addDate: new Date(),
    expiration:  '2099-04-17T04:18:09.302Z',
    status : 'active'
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [NoteCardViewerComponent],
      providers: [{ provide: NoteService, useValue: new MockNoteService() }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(NoteCardViewerComponent);
      noteCard = fixture.componentInstance;

      fixture.detectChanges();
    });
  }));

  it('contains a doorBoardID \'doorboard\'', () => {
    expect(testNote.doorBoardID === 'doorboard').toBe(true);
  });

  it('contains a message \'Filler text\'', () => {
    expect(testNote.body === 'Filler text').toBe(true);
  });

  it('contains a expiration date \'2099-04-17T04:18:09.302Z\'', () => {
    expect(testNote.expiration === '2099-04-17T04:18:09.302Z').toBe(true);
  });

});
