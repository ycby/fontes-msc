var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var SigilExampleSchema = new Schema (
    {
    sigil: {type: String},
    meaning: {type: String}
    },
    {collection: "sigilexamples"}
);

SigilExampleSchema
.virtual("url")
.get(function() {
    return app.locals.baseUrl + "path/" + this._id;
})


//export schema
module.exports = mongoose.model("SigilExample", SigilExampleSchema);
