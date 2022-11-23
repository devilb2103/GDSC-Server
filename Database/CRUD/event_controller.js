const { eventsTable, db } = require('../setup');
const crypto = require('crypto');
const { hasPrevelige } = require('./auth_controller');

var events = {};

const doc = db.ref('events').on('value', async (snapshot) => {
  await loadEvents();
});

async function refreshEvents() {
  if ((events = {})) {
    await loadEvents();
  }
}

async function getEvents(uid, res) {
  try {
    privelegeStatus = await hasPrevelige(uid, 'Member');

    if (privelegeStatus.status == false) {
      return res.status(400).send({
        status: privelegeStatus.status,
        message: privelegeStatus.message,
      });
    } else {
      if ((events = {})) {
        await loadEvents();
      }
      return res.status(200).send({ status: true, message: events });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function loadEvents() {
  try {
    await eventsTable.once('value', async (snapshot) => {
      events = snapshot.val();
    });
  } catch (error) {
    console.log({
      status: false,
      message: `${error}`,
    });
  }
}

async function addEvent(uid, name, description, date, startTime, endTime, res) {
  try {
    await refreshEvents();
    privelegeStatus = await hasPrevelige(uid, 'EventManager');

    if (privelegeStatus.status == false) {
      return res.status(400).send({
        status: privelegeStatus.status,
        message: privelegeStatus.message,
      });
    } else {
      const id = crypto.randomBytes(33).toString('hex');
      await eventsTable.child(`${id}`).set({
        name: name,
        description: description,
        date: date,
        startTime: startTime,
        endTime: endTime,
        participants: [],
      });
      return res
        .status(200)
        .send({ status: true, message: `Event with id ${id} Added` });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function removeEvent(eid, uid, res) {
  try {
    await refreshEvents();
    privelegeStatus = await hasPrevelige(uid, 'EventManager');

    if (privelegeStatus.status == false) {
      return res.status(400).send({
        status: privelegeStatus.status,
        message: privelegeStatus.message,
      });
    } else {
      await eventsTable.child(`${eid}`).remove();
      return res
        .status(200)
        .send({ status: true, message: `Event wih id ${eid} removed` });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function updateEvent(
  eid,
  uid,
  name,
  description,
  date,
  startTime,
  endTime,
  res
) {
  try {
    await refreshEvents();
    privelegeStatus = await hasPrevelige(uid, 'EventManager');

    if (privelegeStatus.status == false) {
      return res.status(400).send({
        status: privelegeStatus.status,
        message: privelegeStatus.message,
      });
    } else {
      await eventsTable.child(`${eid}`).set({
        name: name,
        description: description,
        date: date,
        startTime: startTime,
        endTime: endTime,
        participants: [],
      });
      return res
        .status(200)
        .send({ status: true, message: `Event wih id ${eid} updated` });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function addEventParticipants(eid, uid, res) {
  try {
    await refreshEvents();
    privelegeStatus = await hasPrevelige(uid, 'Member');

    if (privelegeStatus.status == false) {
      return res.status(400).send({
        status: privelegeStatus.status,
        message: privelegeStatus.message,
      });
    } else {
      if (eid in events) {
        const event = events[`${eid}`];
        var participants = event.participants;
        if (participants == undefined) {
          participants = [];
        }
        if (!participants.includes(uid)) {
          participants.push(uid);
          const participantsPath = `${eid}/participants`;
          await eventsTable.update({ [participantsPath]: participants });
          res.status(200).send({
            status: true,
            message: `successfully added the participant ${uid} to ${eid} participants`,
          });
        } else {
          res.status(400).send({
            status: false,
            message: `user with uid ${uid} already has enrolled for event ${eid}`,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: `Could not find event with eid ${eid}`,
        });
      }
    }
  } catch (e) {
    // throw error;
    res.status(400).send({
      status: false,
      message: `${e}`,
    });
  }
}

async function removeEventParticipant(eid, uid, res) {
  try {
    await refreshEvents();
    privelegeStatus = await hasPrevelige(uid, 'Member');

    if (privelegeStatus.status == false) {
      return res.status(400).send({
        status: privelegeStatus.status,
        message: privelegeStatus.message,
      });
    } else {
      if (eid in events) {
        const event = events[`${eid}`];
        var participants = event.participants;
        if (participants == undefined) {
          participants = [];
        }
        if (participants.includes(uid)) {
          participants.pop(participants.indexOf(uid));
          const participantsPath = `${eid}/participants`;
          await eventsTable.update({ [participantsPath]: participants });
          res.status(200).send({
            status: true,
            message: `successfully removed the user ${uid} from event ${eid}`,
          });
        } else {
          res.status(400).send({
            status: false,
            message: `user with uid ${uid} is not a participant of the event with eid ${eid}`,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: `Could not find event with eid ${eid}`,
        });
      }
    }
  } catch (e) {
    // throw error;
    res.status(400).send({
      status: false,
      message: `${e}`,
    });
  }
}

module.exports = {
  getEvents: getEvents,
  addEvent: addEvent,
  updateEvent: updateEvent,
  removeEvent: removeEvent,
  addEventParticipants: addEventParticipants,
  removeEventParticipant: removeEventParticipant,
};
