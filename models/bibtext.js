var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var BibTextSchema = new Schema (
    {
    author: {type: String},
    title: {type: String},
    text_edition: {type: String},
    publication_details: {type: String},
    date: {type: Date},
    updated: {type: Date}
    },
    {collection: "bibtext"}
);

BibTextSchema
.virtual("url")
.get(function() {
    return "/path/" + this._id;
})


//export schema
module.exports = mongoose.model("BibText", BibTextSchema);
