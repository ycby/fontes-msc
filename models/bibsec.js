var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var BibSecSchema = new Schema (
    {
    name_and_year: {type: String},
    details: {type: String},
    date: {type: Date},
    updated: {type: Date}
    },
    {collection: "bibsec"}
);

BibSecSchema
.virtual("url")
.get(function() {
    return app.locals.baseUrl + "path/" + this._id;
})


//export schema
module.exports = mongoose.model("BibSec", BibSecSchema);
