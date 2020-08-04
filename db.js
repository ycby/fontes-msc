var mongoose = require("mongoose")
var mongoDB = "mongodb://127.0.0.1:27017/fontes";

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoDB connection error: "));

module.exports = db;
