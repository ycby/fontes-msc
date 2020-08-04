var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var AngloSaxonAuthorSchema = new Schema (
    {
    author: {type: String},
    text_author: {type: String}
    },
    {collection: "localanglosaxonauthor"}
);

AngloSaxonAuthorSchema
.virtual("url")
.get(function() {
    return "/path/" + this._id;
})


//export schema
module.exports = mongoose.model("AngloSaxonAuthor", AngloSaxonAuthorSchema);
