const newsAPI = require('newsapi');

const newsApi = new newsAPI('988acbcee5c04e00ac5652edfff5342b');

module.exports = {
  newsApi: newsApi,
};
// https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=988acbcee5c04e00ac5652edfff5342b
