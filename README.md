## Table of Contents
- What is DoorBoard?
- How can DoorBoard be Used?
- Features
- Documentation
- Testing and Continuous Integration
- Browswer Support
- Authors

## What is DoorBoard?
DoorBoard is an announcement app that can display changes in someone’s schedule along with other messages. It was created as a convenient way for professors to communicate with students if they were not at their office. DoorBoard is an alternate solution to sticky notes on an office door allowing greater flexibility via remote posts from owners. 

## How can DoorBoard be Used?
DoorBoard can be used by faculty and staff as  a way to post last minute scheduling announcements or other information remotely and conveniently to visitors. DoorBoard’s capabilities can create specific messages through online or directly at the office. A QR code can be quickly scanned by viewers, sending the viewer to the owner’s DoorBoard URL. 

DoorBoard allows unique owners through an authentication process. Once authenticated an owner can set expiration dates and tailor their messages according to their needs. DoorBoard invites owners to also save favorite notes, and have the ability to pin specific notes for the convenience.

## Features
- Authentication) DoorBoard utilizes the service Auth0. It ensures that you’re the only one altering your DoorBoard page
- Note Expiration) Owners can set an expiration date for a note and it will automatically  delete from the page at that time
- Favorite Notes) Allows owners to save notes and repost at a later date
- Pinned Notes) Pin important notes at the top of the page for viewers to see. Pinned notes will not expire.
- Edit Notes) Owners have the ability to edit what an existing note says or the note’s expiration date
- QR Code) Owners can generate and save a QR code linking to a page displaying their notes
- Time Stamps) View when a note was posted

## Documentation
[How to Deploy DoorBoard Using Digital Ocean](DEPLOYMENT.md) 

## Testing and Continuous Integration
DoorBoard uses Jasmine and Karma for unit testing through the Angular CLI. TravisCI is configured to run these tests. 

## Browser Support
DoorBoard works great in Google Chrome. It doesn't work as well with Microsoft Edge or Safari.

## Authors
DoorBoard was built by a team of students for a software design class at the University of Minnesota Morris. See the GitHub contributors page.
