import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Note, NewNote, SaveNote } from './note';
import { NoteService } from './note.service';

describe('Note service: ', () => {

  const testNotes: Note[] = [
    {
      _id: 'first_id',
      doorBoardID: 'test-id',
      body: 'This is the body of the first test id. It is somewhat long.',
      addDate: new Date(),
      expiration: '2025-03-06T22:03:38+0000',
      status: 'active',
      favorite: false,
      isExpired: false,
      isPinned: true ,
    },
    {
      _id: 'second_id',
      doorBoardID: 'test-id',
      body: 'This is the second test id.',
      addDate: new Date(),
      expiration: '2025-03-06T22:03:38+0000',
      status: 'deleted',
      favorite: false,
      isExpired: false,
      isPinned: false ,
    },
    {
      _id: 'third_id',
      doorBoardID: 'test-id',
      body: 'Third test id body.',
      addDate: new Date(),
      expiration: '2025-03-06T22:03:38+0000',
      status: 'template',
      favorite: false,
      isExpired: false,
      isPinned: true ,
    }
  ];

  const newNote: NewNote = {
      doorBoardID: 'test-id',
      body: 'Fourth body.',
      expiration: '2025-03-06T22:03:38+0000',
      isPinned: true,
      status: 'active'
  };

  let noteService: NoteService;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    noteService = new NoteService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('the getNotesByDoorBoard() method', () => {
    it('calls /api/notes', () => {
      noteService.getNotesByDoorBoard('test-id').subscribe(notes => {
        expect(notes).toBe(testNotes);
      });


      const req = httpTestingController.expectOne(request =>
        request.url.startsWith(noteService.noteUrl)
          && request.params.has('doorBoardID')
      );

      expect(req.request.method).toEqual('GET');

     // Check that the name parameter was 'Chris'
      expect(req.request.params.get('doorBoardID')).toEqual('test-id');

      req.flush(testNotes);
    } );

    // it('sends along the status query-parameter', () => {
    //   noteService.getNotesByDoorBoard('test-id', { status: 'active' }).subscribe(notes => {
    //     expect(notes).toBe(testNotes);
    //   });

    //   const req = httpTestingController.expectOne(request =>
    //     request.url.startsWith(noteService.noteUrl)
    //       && request.params.has('doorBoardID')
    //       && request.params.has('status')
    //   );

    //   expect(req.request.method).toEqual('GET');

    //   expect(req.request.params.get('doorBoardID')).toEqual('test-id');
    //   expect(req.request.params.get('status')).toEqual('active');

    //   req.flush(testNotes);
    // });
  });

  describe('the addNewNote() method', () => {
    it('calls /api/notes/new', () => {
      noteService.addNewNote(newNote).subscribe(id => {
        expect(id).toBe('foo');
      });

      const req = httpTestingController.expectOne(request =>
        request.url.startsWith(noteService.noteUrl + '/new')
      );

      expect(req.request.method).toEqual('POST');

      expect(req.request.body).toEqual(newNote);

      req.flush({id: 'foo'});
    });
  });

  describe('The pinNote method', () => {
    it('calls /api/notes/pin/:id', () => {
      noteService.pinNote(testNotes[0], 'first_id' ).subscribe(id => {
        expect(id).toBe('first_id');
      });
      const req = httpTestingController.expectOne(request =>
          request.url.startsWith(noteService.noteUrl + '/pin/first_id')
        );

      expect(req.request.method).toEqual('POST');

      expect(req.request.body).toEqual(testNotes[0]);

      req.flush({id: 'first_id'});
    });
 });

});
