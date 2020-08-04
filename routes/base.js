var express = require('express');
var router = express.Router();

//GET Homepage
router.get("/", function(req, res) {
    res.redirect("/search/");
});

module.exports = router;
