const { dbUrl } = require('./config');

const { MongoClient } = require('mongodb');

MongoClient.connect(dbUrl, function (err, db) {
  if(err) {
    console.log(err);
    return;
  }

  console.log('Connected succesfully to DB');

  db.close();
});