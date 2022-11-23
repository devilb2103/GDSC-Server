const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { json } = require('body-parser');
const {
  addUser,
  addRole,
  removeRole,
  getRoles,
  hasPrevelige,
} = require('./Database/CRUD/auth_controller');
const {
  addEvent,
  removeEvent,
  updateEvent,
  addEventParticipants,
  removeEventParticipant,
  getEvents,
} = require('./Database/CRUD/event_controller');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

/**
 *
 * all routes here
 *
 * (((AUTH)))
 * - - POST - -
 * 1) Create user document entries on user registration or google/github login (uid is pk, email)
 *
 * (((EVENT ADDITION)))
 * - - POST - -
 * 1) Check if user calling add event has role "event-manager" and only then allow
 *
 * - - POST - -
 * 2) Add event entry to document with sub-attricbutes -->
 *                       (event name, event date, start time, end time, number of participants, participants -> (uid, email))
 *
 * - - GET / POST / PUT - -
 * 3) Enroll for event
 *
 * 4) De-Enroll for event
 *
 * 4) Modify event details
 *
 * (((NEWS COLLECTION)))
 * - - GET - -
 * 1) Get news data off firestore
 *
 * - - POST - -
 * 1) Scrape data off new sites filtered by tech
 * 2) POST data to firestore
 */

app.post('/create/user', async (req, res) => {
  await addUser(req.body.uid, req.body.name, req.body.email, res);
});

app.patch('/create/role', async (req, res) => {
  await addRole(req.body.uid, req.body.role, res);
});

app.get('/read/events', async (req, res) => {
  await getEvents(req.body.uid, res);
});

app.post('/create/event', async (req, res) => {
  await addEvent(
    req.body.uid,
    req.body.name,
    req.body.description,
    req.body.date,
    req.body.startTime,
    req.body.endTime,
    res
  );
});

app.patch('/update/event_participants', async (req, res) => {
  await addEventParticipants(req.body.eid, req.body.uid, res);
});

app.patch('/update/event', async (req, res) => {
  await updateEvent(
    req.body.eid,
    req.body.uid,
    req.body.name,
    req.body.description,
    req.body.date,
    req.body.startTime,
    req.body.endTime,
    res
  );
});

app.delete('/delete/role', async (req, res) => {
  await removeRole(req.body.uid, req.body.role, res);
});

app.delete('/delete/event', async (req, res) => {
  await removeEvent(req.body.eid, req.body.uid, res);
});

app.delete('/delete/event_participants', async (req, res) => {
  await removeEventParticipant(req.body.eid, req.body.uid, res);
});

app.get('/test', async (req, res) => {
  var a = await hasPrevelige('101', 'member');
  console.log(a);
});

app.listen(port, () => console.log(`port ${port}`));
