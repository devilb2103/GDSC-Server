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
  getUserInfo,
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

app.post('/read/events', async (req, res) => {
  await getEvents(req.body.uid, res);
});

app.post('/read/userInfo', async (req, res) => {
  await getUserInfo(req.body.uid, res);
});

app.post('/create/user', async (req, res) => {
  await addUser(req.body.uid, req.body.name, req.body.email, res);
});

app.post('/create/event', async (req, res) => {
  await addEvent(
    req.body.uid,
    req.body.name,
    req.body.description,
    req.body.venue,
    req.body.date,
    req.body.startTime,
    req.body.endTime,
    res
  );
});

app.post('/create/event_participants', async (req, res) => {
  await addEventParticipants(req.body.eid, req.body.uid, res);
});

app.patch('/create/role', async (req, res) => {
  await addRole(req.body.uid, req.body.role, res);
});

app.patch('/update/event', async (req, res) => {
  await updateEvent(
    req.body.eid,
    req.body.uid,
    req.body.name,
    req.body.description,
    req.body.venue,
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

// app.get('/test', async (req, res) => {
//   var a = await hasPrevelige('101', 'member');
//   console.log(a);
// });

app.listen(port, () => console.log(`port ${port}`));
