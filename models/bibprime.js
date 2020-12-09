var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var BibPrimeSchema = new Schema (
    {
    title: {type: String},
    author: {type: String},
    db_title: {type: String},
    db_author: {type: String},
    db_edition: {type: String},
    bhl_number: {type: String},
    bs_number: {type: String},
    location_example: {type: String},
    reference_comment: {type: String},
    publication_details: {type: String},
    date: {type: String},
    updated: {type: Date},
    source_author: {type: Schema.Types.ObjectId, ref: "SourceAuthor"}
    },
    {collection: "bibprime"}
);

BibPrimeSchema
.virtual("url")
.get(function() {
    return app.locals.baseUrl + "search/sourcetext/" + this._id + "/";
});


//export schema
module.exports = mongoose.model("BibPrime", BibPrimeSchema);
