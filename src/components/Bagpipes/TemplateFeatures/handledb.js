const shortid = require('shortid');
const low = require('lowdb');
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('urls.json');
const db = low(adapter);

db.defaults({ urls: [] }).write();

export const saveUrl = (longUrl) => {
  const shortUrl = shortid.generate();
  db.get('urls').push({ shortUrl, longUrl }).write();
  return shortUrl;
};

export const getUrl = (shortUrl) => {
  const urlMapping = db.get('urls').find({ shortUrl }).value();
  return urlMapping ? urlMapping.longUrl : null;
};

