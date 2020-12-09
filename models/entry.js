var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var EntrySchema = new Schema (
    {
    text_reference: {type: String},
    entry_reference: {type: String},
    entry_location: {type: String},
    entry_quote: {type: String},
    source_reference: {type: String},
    source_author: {type: String},
    source_title: {type: String},
    source_location: {type: String},
    source_quote: {type: String},
    source_item_number: {type: String},
    source_edition: {type: String},
    new_source_item: {type: Number}, //????????????????? what does this do????
    bs_number: {type: String},
    bhl_number: {type: String},
    sigil: {type: String},
    comment: {type: String},
    bibliography: {type: String},
    manuscript: {type: String},
    date: {type: Date},
    updated: {type: Date},
    bibliography_prime: {type: Schema.Types.ObjectId, ref: "BibPrime"},
    header: {type: Schema.Types.ObjectId, ref: "Header"}
    },
    {collection: "entry"}
);

EntrySchema
.virtual("url")
.get(function() {
    return app.locals.baseUrl + this._id;
})


//export schema
module.exports = mongoose.model("Entry", EntrySchema);
