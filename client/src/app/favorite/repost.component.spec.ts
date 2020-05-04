import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, AbstractControl, FormGroup } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NoteService } from '../notes/note.service';
import { MockNoteService } from 'src/testing/note.service.mock';
import { RepostNoteComponent } from '../favorite/repost.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { DoorBoardService } from '../doorBoard/doorBoard.service';
import { MockDoorBoardService } from 'src/testing/doorBoard.service.mock';
import { Subscription } from 'rxjs';


/*
 * The ActivatedRouteStub that was in here had HttpParams in it that were set
 * in the provider declaration. That was a bad small that KK didn't understand.
 *
 * This was somewhat helpful: https://angular.io/guide/testing#activatedroutestub
 * but it did not show the providers anywhere.
 *
 * We (Nic and KK) found this helpful for understanding how to work with the ActivatedRouteStub
 * in part because it shows the providers and a lot more context for the example.
 * https://stackblitz.com/angular/bbnpbobmvnb?file=src%2Fapp%2Fhero%2Fhero-detail.component.spec.ts
 */

describe('RepostNoteComponent', () => {
  let repostComponent: RepostNoteComponent;
  let repostNoteForm: FormGroup;
  let calledClose: boolean;
  let fixture: ComponentFixture<RepostNoteComponent>;
  let activatedRoute: ActivatedRouteStub;

  // Activated route stub needs to be initialized. When it's left blank, it passes null
  beforeEach(() => {
     activatedRoute = new ActivatedRouteStub({id: MockNoteService.testNotes[0]._id});
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [ RepostNoteComponent ],
      providers: [
        { provide: NoteService, useValue: new MockNoteService() },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DoorBoardService, useValue: new MockDoorBoardService() }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(RepostNoteComponent);
    repostComponent = fixture.componentInstance;
    fixture.detectChanges();
    repostNoteForm = repostComponent.repostNoteForm;
    expect(repostNoteForm).toBeDefined();
    expect(repostNoteForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(repostComponent).toBeTruthy();
    expect(repostNoteForm).toBeTruthy();
  });

  // it('id should be "first_id"', () => {
  //   expect(this.id).toEqual('first_id');
  // });

  it('form should auto-populate to a valid state', () => {
    expect(repostNoteForm.valid).toBeTruthy();
  });

  describe('The body field:', () => {
    let bodyControl: AbstractControl;

    beforeEach(() => {
      bodyControl = repostComponent.repostNoteForm.controls[`body`];
    });

    it('should auto-populate with the body of the appropriate note', () => {
      // This is the value provided by MockNoteService
      /*
       * This is wrong. You want to get the body from `MockNoteService.testNotes`
       * that has the id that you're setting in the paramMap above.
       * - NFM - 22 Apr 2020
       */
      expect(bodyControl.value).toEqual(MockNoteService.testNotes[0].body);
    });

    it('should not allow empty bodies', () => {
      bodyControl.setValue('');
      expect(bodyControl.valid).toBeFalsy();
      expect(bodyControl.hasError('required')).toBeTruthy();
    });

    it('should be fine with "late to office hours"', () => {
      bodyControl.setValue('late to office hours');
      expect(bodyControl.valid).toBeTruthy();
    });

    it('should fail on single character bodies', () => {
      bodyControl.setValue('x');
      expect(bodyControl.valid).toBeFalsy();
      expect(bodyControl.hasError('minlength')).toBeTruthy();
    });

    it('should fail on really long bodies', () => {
      bodyControl.setValue('x'.repeat(1000));
      expect(bodyControl.valid).toBeFalsy();
      expect(bodyControl.hasError('maxlength')).toBeTruthy();
    });
  });
});
