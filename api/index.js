const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const {
  addUser,
  addRole,
  removeRole,
  getUserInfo,
  addUserInfo,
} = require('../Database/CRUD/auth_controller');
const {
  addEvent,
  removeEvent,
  updateEvent,
  addEventParticipants,
  removeEventParticipant,
  getEvents,
  getEventParticipants,
} = require('../Database/CRUD/event_controller');
const { getNews } = require('../Database/CRUD/news_controller');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/health', async (req, res) => {
  res.status(200).send('Server is up and running...');
});

app.post('/read/events', async (req, res) => {
  await getEvents(req.body.uid, res);
});

app.post('/read/event/participants', async (req, res) => {
  await getEventParticipants(req.body.eid, req.body.uid, res);
});

app.post('/read/userInfo', async (req, res) => {
  await getUserInfo(req.body.uid, res);
});

app.post('/read/news', async (req, res) => {
  await getNews(req.body.uid, res);
});

app.post('/create/user', async (req, res) => {
  await addUser(req.body.uid, req.body.name, req.body.email, res);
});

app.post('/create/event', async (req, res) => {
  await addEvent(
    req.body.uid,
    req.body.domain,
    req.body.name,
    req.body.description,
    req.body.venue,
    req.body.startDate,
    req.body.endDate,
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
    req.body.domain,
    req.body.name,
    req.body.description,
    req.body.venue,
    req.body.startDate,
    req.body.endDate,
    req.body.startTime,
    req.body.endTime,
    res
  );
});

app.post('/update/user', async (req, res) => {
  await addUserInfo(
    req.body.uid,
    req.body.name,
    req.body.prn,
    req.body.number,
    req.body.branch,
    req.body.pfp,
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
