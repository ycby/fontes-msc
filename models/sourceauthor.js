var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//First copy exactly as is
var SourceAuthorSchema = new Schema (
    {
    author: {type: String},
    db_author: {type: String}
    },
    {collection: "localsourceauthor"}
);

SourceAuthorSchema
.virtual("url")
.get(function() {
    return app.locals.baseUrl + "path/" + this._id;
})


//export schema
module.exports = mongoose.model("SourceAuthor", SourceAuthorSchema);
