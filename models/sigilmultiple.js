var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var SigilMultipleSchema = new Schema (
    {
    sigil: {type: String},
    meaning: {type: String}
    },
    {collection: "sigilmultiple"}
);

SigilMultipleSchema
.virtual("url")
.get(function() {
    return app.locals.baseUrl + "path/" + this._id;
})


//export schema
module.exports = mongoose.model("SigilMultiple", SigilMultipleSchema);
