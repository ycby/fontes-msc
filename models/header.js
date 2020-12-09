var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var HeaderSchema = new Schema (
    {
    text_reference: {type: String, required: true},
    text_author: {type: String},
    new_title: {type: String},
    text_title: {type: String},
    text_edition: {type: String},
    contributor: {type: String},
    entries: {type: Number},
    transmission: {type: String},
    bibliography: {type: String},
    date: {type: Date},
    updated: {type: Date}
    },
    {collection: "header"}
);

HeaderSchema
.virtual("url")
.get(function() {
    return app.locals.baseUrl + "search/targettext/" + this._id + "/";
});

//export schema
module.exports = mongoose.model("Header", HeaderSchema);
