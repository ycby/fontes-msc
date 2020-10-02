var mongoose = require("mongoose")

//the local one has the latest changes. this is the location information sometimes being read as a date fix.
var mongoDB = "mongodb://127.0.0.1:27017/fontes";

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoDB connection error: "));

module.exports = db;
