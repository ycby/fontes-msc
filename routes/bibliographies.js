var express = require('express');
var router = express.Router();

var db = require("../db");
var bibliographyController = require("../controllers/bibliographyController");

//GET Homepage
router.get("/", bibliographyController.index);

router.get("/csv/", bibliographyController.csvdownload);

router.get("/print/", bibliographyController.print);

module.exports = router;
