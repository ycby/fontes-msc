var express = require('express');
var router = express.Router();

var db = require("../db");
var searchController = require("../controllers/searchController");

//GET search
router.get("/", searchController.index);

//GET print
router.get("/print", searchController.getPrint);

//GET csv
router.get("/csv", searchController.getCSV);

//GET source texts given target texts
router.get("/targettext/:targetid", searchController.getSourcesForTargetText);

//GET print source texts given target texts
router.get("/targettext/:targetid/print", searchController.getPrintSourcesForTargetText);

// GET CSV source texts given target texts
router.get("/targettext/:targetid/csv", searchController.getCSVSourcesForTargetText);

//GET entries given source text and target text
router.get("/targettext/:targetid/sourcetext/:sourceid", searchController.getEntries);

//GET for print page
router.get("/targettext/:targetid/sourcetext/:sourceid/print", searchController.printEntries);

//GET for CSV page
router.get("/targettext/:targetid/sourcetext/:sourceid/csv", searchController.csvEntries);

//GET suggestions
router.get("/targetsuggestions", searchController.getTargetSuggestions);

//GET suggestions
router.get("/sourcesuggestions", searchController.getSourceSuggestions);

//GET Source Texts
// router.get("/sourcetext", searchController.getSourceTexts);

//GET target texts given source texts
router.get("/sourcetext/:sourceid", searchController.getTargetsForSourceText);

//GET print target texts given source texts
router.get("/sourcetext/:sourceid/print", searchController.getPrintTargetsForSourceText);

//GET CSV target texts given source texts
router.get("/sourcetext/:sourceid/csv", searchController.getCSVTargetsForSourceText);

//GET entries given source text and target text
router.get("/sourcetext/:sourceid/targettext/:targetid", searchController.getEntries);

//GET for print page
router.get("/sourcetext/:sourceid/targettext/:targetid/print", searchController.printEntries);

//GET for csv page
router.get("/sourcetext/:sourceid/targettext/:targetid/csv", searchController.csvEntries);

module.exports = router;
