const { eventsTable } = require('../setup');
const crypto = require('crypto');

async function addEvent(name, description, date, startTime, endTime, res) {
  try {
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
      .send({ status: true, message: `Event wih id ${id} Added` });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function removeEvent(id, res) {
  try {
    await eventsTable.child(`${id}`).remove();
    return res
      .status(200)
      .send({ status: true, message: `Event wih id ${id} removed` });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function updateEvent(
  eid,
  name,
  description,
  date,
  startTime,
  endTime,
  res
) {
  try {
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
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function addEventParticipants(eid, uid, res) {
  try {
    eventsTable.child(`${eid}`).once('value', async (snapshot) => {
      if (snapshot.exists()) {
        const event = snapshot.val();
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
    });
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
    eventsTable.child(`${eid}`).once('value', async (snapshot) => {
      if (snapshot.exists()) {
        const event = snapshot.val();
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
    });
  } catch (e) {
    // throw error;
    res.status(400).send({
      status: false,
      message: `${e}`,
    });
  }
}

module.exports = {
  addEvent: addEvent,
  updateEvent: updateEvent,
  removeEvent: removeEvent,
  addEventParticipants: addEventParticipants,
  removeEventParticipant: removeEventParticipant,
};
