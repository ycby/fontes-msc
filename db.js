var mongoose = require("mongoose")

const {
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true
};

//the local one has the latest changes. this is the location information sometimes being read as a date fix.
var mongoDB = `mongodb://${MONGO_HOSTNAME}:${MONGO_HOSTNAME}/${MONGO_DB}`;

//mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.connect(mongoDB, options).then( function() {
  console.log('MongoDB is connected');
})
  .catch( function(err) {
  console.log(err);
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoDB connection error: "));

module.exports = db;
