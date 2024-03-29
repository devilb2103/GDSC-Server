const admin = require('firebase-admin');
const serviceAccount = require('./service-account-cred.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://the-gdsc-club-app-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const db = admin.database();
var usersTable = db.ref('users');
var eventsTable = db.ref('events');
var newsTable = db.ref('news');

module.exports = {
  db: db,
  usersTable: usersTable,
  eventsTable: eventsTable,
  newsTable: newsTable,
};
