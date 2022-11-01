const { eventsTable } = require('../setup');

async function addEvent(eid, name, description, Date, startTime, endTime) {
  await eventsTable.child(eid).set({
    name: name,
    description: description,
    Date: Date,
    startTime: startTime,
    endTime: endTime,
    enrolled_users: [],
  });
}

module.exports = {
  addEvent: addEvent,
};
