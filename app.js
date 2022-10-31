const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
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

app.listen(port, () => console.log(`port ${port}`));
