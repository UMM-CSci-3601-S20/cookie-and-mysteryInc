import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDoorBoardService } from 'src/testing/doorBoard.service.mock';
import { AddDoorBoardComponent } from './add-doorBoard.component';
import { DoorBoardService } from './doorBoard.service';

describe('AddDoorBoardComponent', () => {
  let addDoorBoardComponent: AddDoorBoardComponent;
  let addDoorBoardForm: FormGroup;
  let calledClose: boolean;
  let fixture: ComponentFixture<AddDoorBoardComponent>;

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
      declarations: [AddDoorBoardComponent],
      providers: [{ provide: DoorBoardService, useValue: new MockDoorBoardService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(AddDoorBoardComponent);
    addDoorBoardComponent = fixture.componentInstance;
    addDoorBoardComponent.ngOnInit();
    fixture.detectChanges();
    addDoorBoardForm = addDoorBoardComponent.addDoorBoardForm;
    expect(addDoorBoardForm).toBeDefined();
    expect(addDoorBoardForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(addDoorBoardComponent).toBeTruthy();
    expect(addDoorBoardForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(addDoorBoardForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addDoorBoardComponent.addDoorBoardForm.controls[`name`];
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "Captain Kirk"', () => {
      nameControl.setValue('Captain Kirk');
      expect(nameControl.valid).toBeTruthy();
    });

    // it('should fail on single character names', () => {
    //   nameControl.setValue('x');
    //   expect(nameControl.valid).toBeFalsy();
    //   // Annoyingly, Angular uses lowercase 'l' here
    //   // when it's an upper case 'L' in `Validators.minLength(2)`.
    //   expect(nameControl.hasError('minlength')).toBeTruthy();
    // });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long names', () => {
      nameControl.setValue('x'.repeat(200));
      expect(nameControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('ProQUickScopeMonster360');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('The building field', () => {
    let buildingControl: AbstractControl;

    beforeEach(() => {
      buildingControl = addDoorBoardComponent.addDoorBoardForm.controls[`building`];
    });

    it('should not allow empty buildings', () => {
      buildingControl.setValue('');
      expect(buildingControl.valid).toBeFalsy();
    });

    it('should be fine with "The Enterprise"', () => {
      buildingControl.setValue('The Enterprise');
      expect(buildingControl.valid).toBeTruthy();
    });

    it('should fail on empty buildings', () => {
      buildingControl.setValue('');
      expect(buildingControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long building names', () => {
      buildingControl.setValue('x'.repeat(150));
      expect(buildingControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(buildingControl.hasError('maxlength')).toBeTruthy();
    });


    it('should allow digits in the building', () => {
      buildingControl.setValue('ProQUickScopeMonster360');
      expect(buildingControl.valid).toBeTruthy();
    });
  });

  describe('The email field', () => {
    let emailControl: AbstractControl;

    beforeEach(() => {
      emailControl = addDoorBoardComponent.addDoorBoardForm.controls[`email`];
    });

    it('should not allow empty values', () => {
      emailControl.setValue('');
      expect(emailControl.valid).toBeFalsy();
      expect(emailControl.hasError('required')).toBeTruthy();
    });

    it('should accept legal emails', () => {
      emailControl.setValue('conniestewart@ohmnet.com');
      expect(emailControl.valid).toBeTruthy();
    });

    it('should fail without @', () => {
      emailControl.setValue('conniestewart');
      expect(emailControl.valid).toBeFalsy();
      expect(emailControl.hasError('email')).toBeTruthy();
    });
  });

  describe('The office number field', () => {
    let officeNumberControl: AbstractControl;

    beforeEach(() => {
      officeNumberControl = addDoorBoardComponent.addDoorBoardForm.controls[`officeNumber`];
    });

    it('should not allow empty office number', () => {
      officeNumberControl.setValue('');
      expect(officeNumberControl.valid).toBeFalsy();
    });

    it('should be fine with "1234a"', () => {
      officeNumberControl.setValue('1234a');
      expect(officeNumberControl.valid).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long names', () => {
      officeNumberControl.setValue('x'.repeat(100));
      expect(officeNumberControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(officeNumberControl.hasError('maxlength')).toBeTruthy();
    });


  });

});
