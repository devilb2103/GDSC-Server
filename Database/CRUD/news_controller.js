const inshorts = require('inshorts-news-api');
const moment = require('moment/moment');
const { newsApi } = require('../news_api');
const { newsTable, db } = require('../setup');
const { hasPrevelige } = require('./auth_controller');

var news = {};
var nextRefreshDate = moment();

const tempDoc = db.ref('news/tempData').on('value', async (snapshot) => {
  try {
    nextRefreshDate = moment(snapshot.val()['nextUpdateTime']);
  } catch {}
});

const newsDoc = db.ref('news/newsData').on('value', async (snapshot) => {
  news = snapshot.val();
});

async function refreshNews() {
  try {
    if (moment().isAfter(nextRefreshDate)) {
      // write latest news to db logic
      // var x = await getNewsDataNewsAPI();
      var x = await getNewsDataInShortsAPI2();
      console.log(x);

      if (x['data'] == undefined || x['data'] == null || x['data'] == []) {
        console.log(x['data']);
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

async function getNewsDataInShortsAPI() {
  var x = await inshorts.getNewsCustom();
  return x;
}

async function getNewsDataInShortsAPI2() {
  var options = {
    lang: 'en',
    category: 'technology',
  };
  var resp = {};
  var y = await inshorts.getNews(options, (x) => {
    resp['category'] = 'Technology';
    resp['count-articles'] = x.length;
    resp['data'] = x;
  });

  return resp;
}

module.exports = {
  getNews: getNews,
};
