package umm3601.note;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import javax.sound.sampled.SourceDataLine;

import java.time.Instant;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.FindIterable;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonCodecRegistry;
import static com.mongodb.client.model.Updates.set;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.ConflictResponse;
import io.javalin.http.Context;
import io.javalin.http.ForbiddenResponse;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.UnauthorizedResponse;
import umm3601.JwtProcessor;
import umm3601.UnprocessableResponse;
import umm3601.doorboard.DoorBoard;



/**
 * Controller that manages requests for note data (for a specific doorBoard).
 */
public class NoteController {

  private final String ISO_8601_REGEX = "([+-]\\d\\d)?\\d\\d\\d\\d-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d([+, -.])\\d\\d\\d[\\dZ]";

  private final JwtProcessor jwtProcessor;

  private long currentDateTime;

  JacksonCodecRegistry jacksonCodecRegistry = JacksonCodecRegistry.withDefaultObjectMapper();

  private final MongoCollection<Note> noteCollection;
  private final MongoCollection<DoorBoard> doorBoardCollection;

  /**
   * @param database the database containing the note data
   */

  public NoteController(
      MongoDatabase database,
      JwtProcessor jwtProcessor) {
    jacksonCodecRegistry.addCodecForClass(Note.class);
    jacksonCodecRegistry.addCodecForClass(DoorBoard.class);

    noteCollection = database.getCollection("notes").withDocumentClass(Note.class)
        .withCodecRegistry(jacksonCodecRegistry);

    doorBoardCollection = database.getCollection("doorBoards").withDocumentClass(DoorBoard.class)
        .withCodecRegistry(jacksonCodecRegistry);

    this.jwtProcessor = jwtProcessor;
    currentDateTime = Instant.now().toEpochMilli();
  }

  /**
   * Given the ObjectId, as a hex string, of a DoorBoard in the database,
   * return that DoorBoard.
   *
   * Returns null if the ObjectId doesn't correspond to any DoorBoard in the
   * database.
   *
   * Throws an IllegalArgumentException if doorBoardID isn't a valid ObjectId.
   */
  private DoorBoard getDoorBoard(String doorBoardID) {
    return doorBoardCollection
      .find(eq("_id", new ObjectId(doorBoardID)))
      .first();
  }

  /**
   * Delete a note belonging to a specific doorBoard.
   * Uses the following parameters in the request:
   *
   * `id` parameter -> note id
   * `doorBoardID` -> which doorBoard's notes
   *
   * @param ctx a Javalin HTTP context
   */

  public void deleteNote(Context ctx) {
    String id = ctx.pathParam("id");

    // This throws an UnauthorizedResponse if the user isn't logged in.
    String currentUserSub = jwtProcessor.verifyJwtFromHeader(ctx).getSubject();
    System.out.println("It got to the Note Controller");
    Note note;
    try {
      note = noteCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested note id wasn't a legal Mongo Object ID.");
    }

    if (note == null) {
      throw new NotFoundResponse("The requested note does not exist.");
    }

    String subOfOwnerOfNote = getDoorBoard(note.doorBoardID).sub;
    if (!currentUserSub.equals(subOfOwnerOfNote)) {
      throw new ForbiddenResponse("The requested note does not belong to this doorBoard. It cannot be deleted.");
    }

    noteCollection.deleteOne(eq("_id", new ObjectId(id)));
    ctx.status(204);
  }


  private void filterExpiredNotes(List<Note> notes) {
    System.out.println("Filtering out expired notes!!!!!");
    for(int i = 0; i < notes.size(); i++){ // running through each index of the array
      if(notes.get(i).expiration != null){ // making sure the expiration date exists
      long testExpire = Instant.parse(notes.get(i).expiration).toEpochMilli();
      currentDateTime = Instant.now().toEpochMilli();

      if(checkIfExpired(testExpire) ) {
        String removeID = notes.get(i)._id;
        noteCollection.deleteOne(eq("_id",new ObjectId(removeID)));
        }
      }
    }
  }

  public void getNoteByID(Context ctx) {
    String id = ctx.pathParam("id");
    Note note;

    try {
      note = noteCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested note id wasn't a legal Mongo Object ID.");
    }
    if (note == null) {
      throw new NotFoundResponse("The requested note was not found");
    } else {
      ctx.json(note);
    }
  }

  private boolean checkIfExpired(Long expiredDate){
    if(expiredDate != null){
    if(currentDateTime >= expiredDate){
  private boolean checkIfExpired(Long expiredDate) {
    if(expiredDate != null) {
    if(currentDateTime >= expiredDate) {
      return true;
    }}
    return false;
  }

  /**
   * Get a sorted JSON response in ascending order that filters by the query parameters
   * supplied by the Javalin HTTP context
   *
   * @param ctx a Javalin HTTP context
   */
  public void getNotesByDoorBoard(Context ctx) {
    checkCredentialsForGetNotesRequest(ctx);

    // If we've gotten this far without throwing an exception,
    // the client has the proper credentials to make the get request.

    List<Bson> filters = new ArrayList<Bson>(); // start with a blank JSON document
    if (ctx.queryParamMap().containsKey("doorBoardID")) {
      String targetDoorBoardID = ctx.queryParam("doorBoardID");
      System.out.println(targetDoorBoardID);
      filters.add(eq("doorBoardID", targetDoorBoardID));
      List<Note> notes = noteCollection.find(and(filters)).into(new ArrayList<>()); // creating an Array List of notes from database
      // from a specific owner id
      filterExpiredNotes(notes); // filtering out and deleting expired notes
    }
    if (ctx.queryParamMap().containsKey("body")) {
      filters.add(regex("body", ctx.queryParam("body"), "i"));
    }
    if (ctx.queryParamMap().containsKey("status")) {
      filters.add(eq("status", ctx.queryParam("status")));
    }

    String sortBy = ctx.queryParam("sortBy", "status"); //Sort by query param, default being `status`
    String sortOrder = ctx.queryParam("sortorder", "asc");

    ctx.json(noteCollection.find(filters.isEmpty() ? new Document() : and(filters))
      .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))
      .into(new ArrayList<>()));
  }

  /**
   * Check whether the user is allowed to perform this get request, or if
   * we should abort and send back some sort of error response.
   *
   * As a precondition, `ctx` should be a GET request to /api/notes.
   *
   * If the user has the right credentials, this method does nothing, and you
   * can proceed as normal
   *
   * If the user doesn't have the right credentials, this method will throw
   * some subclass of HttpResponseException.
   */
  private void checkCredentialsForGetNotesRequest(Context ctx) {
    if (ctx.queryParamMap().containsKey("status")
        && ctx.queryParam("status").equals("active")) {
      // Anyone is allowed to view active notes, even if they aren't logged in.
      return;
    }

    // For any other request, you have to be logged in.
    String currentUserSub;
    try {
      currentUserSub = jwtProcessor.verifyJwtFromHeader(ctx).getSubject();
    } catch (UnauthorizedResponse e) {
      throw e;
      // Catch and rethrow, just to be explicit.
    }

    // You can't view everyone's notes (unless you're only asking for active
    // notes.)

    if (!ctx.queryParamMap().containsKey("doorBoardID")) {
      throw new ForbiddenResponse(
        "Request not allowed; users can only view their own notes.");
    }

    String subOfOwnerOfDoorBoard = getDoorBoard(ctx.queryParam("doorBoardID")).sub;
    if (!currentUserSub.equals(subOfOwnerOfDoorBoard)) {
      throw new ForbiddenResponse(
        "Request not allowed; users can only view their own notes.");
    }
  }


  /**
   * Add a new note and confirm with a successful JSON response
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewNote(Context ctx) {
    System.out.println("Got to addNewNote method in NoteController");
    //System.out.println(note.doorBoardID);
    System.out.println("<" + ctx.body() + ">");
    Note newNote = ctx.bodyValidator(Note.class)
      .check((note) -> note.doorBoardID != null) // The doorBoardID shouldn't be present; you can't choose who you're posting the note as.
      .check((note) -> note.body != null && note.body.length() > 1) // Make sure the body is not empty -- consider using StringUtils.isBlank to also get all-whitespace notes?
      //.check((note) -> note.status.matches("^(active|draft|deleted|template)$")) // Status should be one of these
      .get();
      System.out.println("We validated good");

    // This will throw an UnauthorizedResponse if the user isn't logged in.
    String currentUserSub = jwtProcessor.verifyJwtFromHeader(ctx).getSubject();


    DoorBoard doorBoard;
    try {
      doorBoard = getDoorBoard(newNote.doorBoardID);
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse(
        newNote.doorBoardID + "does not refer to an existing DoorBoard.");
    }

    if (doorBoard == null) {
      throw new BadRequestResponse(
        newNote.doorBoardID + "does not refer to an existing DoorBoard.");
    }

    if (!doorBoard.sub.equals(currentUserSub)) {
      throw new ForbiddenResponse("You can only add notes to your own DoorBoard.");
    }

    // if(newNote.expiration != null && !(newNote.status.equals("active"))) {
    //   throw new ConflictResponse("Expiration dates can only be assigned to active notices.");
    // }

    if(newNote.expiration != null || newNote.status.equals("deleted")) {
      deathTimer.updateTimerStatus(newNote); //only make a timer if needed
    }
    noteCollection.insertOne(newNote);

    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newNote._id));
  }

  /**
   * Edit an existing note
   */
  public void editNote(Context ctx) {
    String id = ctx.pathParamMap().get("id");

    Note newNote= ctx.bodyValidator(Note.class)
    .check((note) -> note.body.length() >= 2 && note.body.length() <= 300).get();
    String newBody = newNote.body;
    String newExpirationDate = newNote.expiration;

    Note oldNote = noteCollection.findOneAndUpdate(eq("_id", new ObjectId(id)), set("body", newBody));
    System.out.println("OLD EXPIRE: " + oldNote.expiration);
    oldNote = noteCollection.findOneAndUpdate(eq("_id", new ObjectId(id)), set("expiration", newExpirationDate));
    System.out.println("NEW EXPIRE: " + oldNote.expiration);
    if (oldNote == null) {
      ctx.status(400);
      throw new NotFoundResponse("The requested note was not found");
    } else {
      ctx.status(200);
      ctx.json(ImmutableMap.of("id", id));
    }
  }

    /**
     * Silently purge a single notice from the database.
     *
     * A helper function which should never be called directly.
     * This function is not guaranteed to behave well if given an incorrect
     * or invalid argument.
     *
     * @param id the id of the note to be deleted.
     */
    protected void singleDelete(String id) {
      noteCollection.deleteOne(eq("_id", new ObjectId(id)));
    }

    /**
     * Flags a single notice as deleted.
     *
     * A helper function which should never be called directly.
     * Note that this calls UpdateTimerStatus on said note.
     * This function is not guaranteed to behave well
     * if given an incorrect or invalid argument.
     *
     * @param id the id of the note to be flagged.
     */
    protected void flagOneForDeletion(String id) {
    }
  }


