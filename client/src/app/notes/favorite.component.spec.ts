import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';

// DoorBoard imports
import { DoorBoard } from '../doorBoard/doorBoard';
import { DoorBoardService } from '../doorBoard/doorBoard.service';
import { DoorBoardPageComponent } from '../doorBoard/doorBoard-page.component';
import { MockDoorBoardService } from '../../testing/doorBoard.service.mock';

// Note imports
import { Note } from '../notes/note';
import { NoteService } from '../notes/note.service';
import { MockNoteService } from '../../testing/note.service.mock';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavoriteComponent } from '../notes/favorite.component';

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

describe('FavoriteComponent', () => {
  let component: FavoriteComponent;
  let fixture: ComponentFixture<FavoriteComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [FavoriteComponent],
      providers: [
        {provide: DoorBoardService, useValue: new MockDoorBoardService()},
        {provide: NoteService, useValue: new MockNoteService()},
        {provide: activatedRoute, useValue: activatedRoute}
      ]
    })
    .compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(FavoriteComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    component.ngOnInit();

    component = fixture.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DoorBoardPageComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });


});
