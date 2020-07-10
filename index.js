const mongodb = require('mongodb');
const express = require('express');

const app = express();

let db;
const connectionOptions = { poolSize: process.env.MONGO_POOLSIZE || 1 };

mongodb.MongoClient.connect('mongodb://localhost:27017/test', connectionOptions, function(err, database) {
  if (err) throw err;
  db = database.db('test');
  // create some documents required for demonstration
  db.collection('test').insertOne({"a": "b"});

  app.listen(process.env.PORT || 3000, function() {
    console.log(`Express.js server up.`);
  });
});
/*
  For demonstration purposes, this route will always return slowly due to an intentionally slow query (5seconds per document)
*/
app.get('/slow', function (req, res) {
  db.collection('test').find({'$where': 'sleep(5000) || true'}).toArray(function(err, cursor) {
    return res.json({"docCount": 'docs'});
  });
	
});
/*
  This route should always return quickly
*/
app.get('/fast', function (req, res) {
  db.collection('test').countDocuments({}, function(err, count) {
    return res.json({'documentCount': count});
  });
	
});
