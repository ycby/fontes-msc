var express = require('express');
var router = express.Router();

var db = require("../db");
var pinnedController = require("../controllers/pinnedController");

/* GET users listing. */
router.get('/', pinnedController.getPinned);

router.post("/", pinnedController.populatePinnedEntries);

router.post("/print", pinnedController.populatePinnedEntriesPrint);

router.post("/csv", pinnedController.populatePinnedEntriesCSV);

module.exports = router;
