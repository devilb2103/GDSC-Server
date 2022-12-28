const moment = require('moment/moment');
const { newsApi } = require('../news_api');
const { newsTable, db } = require('../setup');
const { hasPrevelige } = require('./auth_controller');

var news = {};
var nextRefreshDate = moment();

const tempDoc = db.ref('news/tempData').on('value', async (snapshot) => {
  try {
    nextRefreshDate = moment.tz(
      snapshot.val()['nextUpdateTime'],
      'YYYY-M-D H:m:s'
    );
  } catch {}
});

const newsDoc = db.ref('news/newsData').on('value', async (snapshot) => {
  news = snapshot.val();
});

async function refreshNews() {
  try {
    if (moment().isAfter(nextRefreshDate)) {
      // write latest news to db logic
      var x = await getNewsData();
      if (x['status'] == 'error') {
        console.log(x);
      } else {
        // write data to db
        await newsTable.child('newsData').set(x);

        //update next update time
        await newsTable.child('tempData').set({
          nextUpdateTime: moment().add(30, 'minutes').toString(),
        });
      }
    }

    if (news == null) {
      news = {};
    }
  } catch (error) {
    console.log({
      status: false,
      message: `${error}`,
    });
  }
}

async function getNews(uid, res) {
  try {
    privelegeStatus = await hasPrevelige(uid, 'Member');

    if (privelegeStatus.status == false) {
      return res.status(200).send({
        status: privelegeStatus.status,
        message: privelegeStatus.message,
      });
    } else {
      await refreshNews();
      return res.status(200).send({ status: true, message: news });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function getNewsData() {
  var x = await newsApi.v2.topHeadlines({
    category: 'technology',
    language: 'en',
    country: 'in',
  });
  return x;
}

module.exports = {
  getNews: getNews,
};
