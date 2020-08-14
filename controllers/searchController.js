var async = require("async");
var mongoose = require("mongoose")
var helpers = require("./helpers")
var moment = require("moment")
var stringify = require("csv-stringify")

var BibPrime = require("../models/bibprime");
var BibSec = require("../models/bibsec");
var Entry = require("../models/entry");
var Header = require("../models/header");

var activepage = "search";

const STEPSIZE = 30;
const ENTRYSTEPSIZE = 10;


exports.index = function(req, res) {

    console.log(req.query)
    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    if (req.query.texttype == "source-text") {

        getSourceTexts(pageNo, "search", req.query, res);
    } else {

        getTargetTexts(pageNo, "search", req.query, res);
    }
}

exports.getPrint = function(req, res) {

    var reqQuery = req.query;

    reqQuery.stepSize = -1;
    reqQuery.pageNo = 1;

    if (req.query.texttype == "source-text") {

        getSourceTexts(reqQuery.pageNo, "printtexts", reqQuery, res);
    } else {

        getTargetTexts(reqQuery.pageNo, "printtexts", reqQuery, res);
    }
}

exports.getCSV = function(req, res) {

    var reqQuery = req.query;

    reqQuery.stepSize = -1;
    reqQuery.pageNo = 1;

    if (req.query.texttype == "source-text") {

        getSourceCSV(reqQuery.pageNo, reqQuery, res);
    } else {

        getTargetCSV(reqQuery.pageNo, reqQuery, res);
    }

}

function getTargetCSV(pageNo, reqQuery, res) {

    var query = queryBuilderHeader(reqQuery.title, reqQuery.author, reqQuery.edition, reqQuery.reference);

    //force reqQuery to init on target-text
    reqQuery.texttype = "target-text";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(Header, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(Header, query, reqQuery.stepSize != null ? reqQuery.stepSize : STEPSIZE, pageNo - 1, {new_title: 1}).exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=target_texts.csv");

        stringify(helpers.formatHeaderCSV(results.records), {header: true}).pipe(res);

    });
}

function getSourceCSV(pageNo, reqQuery, res) {

    var query = queryBuilderBibPrime(reqQuery.title, reqQuery.author, reqQuery.edition);

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibPrime, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibPrime, query, reqQuery.stepSize != null ? reqQuery.stepSize : STEPSIZE, pageNo - 1, {title: 1}).exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=source_texts.csv");

        stringify(helpers.formatBibPrimeCSV(results.records), {header: true}).pipe(res);
    });
}

exports.getTargetSuggestions = function(req, res) {

    var title = req.query.title;

    var query = {};

    if (title != "") {
        query.text_title = new RegExp("^" + title, "i");
    }

    helpers.documentSearch(Header, query, 6, 0, {text_title: 1}).exec(function(err, results) {

        if (err) throw err;

        res.send(results);
    });
}

exports.getSourceSuggestions = function(req, res) {

    var title = req.query.title;

    var query = {};

    console.log(query);

    if (title != "") {
        query.title = new RegExp("^" + title, "i");
    }

    helpers.documentSearch(BibPrime, query, 6, 0, {title: 1}).exec(function(err, results) {

        if (err) throw err;

        res.send(helpers.formatSuggestions(results));
    });
}

function getTargetTexts(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderHeader(reqQuery.title, reqQuery.author, reqQuery.edition, reqQuery.reference);
    // console.log(reqQuery);

    //force reqQuery to init on target-text
    reqQuery.texttype = "target-text";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(Header, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(Header, query, reqQuery.stepSize != null ? reqQuery.stepSize : STEPSIZE, pageNo - 1, {new_title: 1}).exec(callback);
        }
    }, function(err, results) {
        res.render(pageToRender, helpers.formatRender(err,
                                            activepage,
                                            reqQuery.stepSize == null ? STEPSIZE : results.recordcount,
                                            reqQuery,
                                            pageNo,
                                            helpers.formatHeader(results.records),
                                            results.recordcount,
                                            {title: "", url: ""},
                                            {title: "", url: ""}));
    });
}

exports.getEntries = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        targetInfo: function(callback) {
            Header
            .findById(req.params.targetid)
            .exec(callback);
        },
        sourceInfo: function(callback) {
            BibPrime
            .findById(req.params.sourceid)
            .exec(callback);
        },
        entries: function(callback){

            //get all entries
            helpers.documentSearch(Entry, {header: req.params.targetid, bibliography_prime: req.params.sourceid}, -1, pageNo - 1, {}).populate("bibliography_prime").exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        var newStepSize = req.query.stepSize == null ? ENTRYSTEPSIZE : results.entries.length;

        var renderedInfo = helpers.formatRender(err,
                        activepage,
                        newStepSize,
                        req.query,
                        pageNo,
                        helpers.formatEntries(results.entries).slice((pageNo - 1) * newStepSize, pageNo * newStepSize),
                        results.entries.length,
                        {title: results.targetInfo.text_title, author: results.targetInfo.text_author, edition: results.targetInfo.text_edition, contributor: results.targetInfo.contributor, date: results.targetInfo.date, url: results.targetInfo.url},
                        {title: results.sourceInfo.title, author: results.sourceInfo.author, edition: results.sourceInfo.db_edition, url: results.sourceInfo.url});

        renderedInfo.citeinfo = helpers.formatCiteInfo(results.targetInfo);

        console.log(renderedInfo);

        res.render("searchentries", renderedInfo);
    });
}

function getSourceTexts(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderBibPrime(reqQuery.title, reqQuery.author, reqQuery.edition);

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibPrime, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibPrime, query, reqQuery.stepSize != null ? reqQuery.stepSize : STEPSIZE, pageNo - 1, {title: 1}).exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.render(pageToRender, helpers.formatRender(err,
                                            activepage,
                                            reqQuery.stepSize == null ? STEPSIZE : results.recordcount,
                                            reqQuery,
                                            pageNo,
                                            helpers.formatBibPrime(results.records),
                                            results.recordcount,
                                            {title: "", url: ""},
                                            {title: "", url: ""}))
    });
}

exports.getSourcesForTargetText = function(req, res) {

    // res.send("NOT IMPLEMENTED " + req.params.targetid);
    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        selectedtext: function(callback) {
            helpers.documentById(Header, req.params.targetid).exec(callback);
        },
        records: function(callback) {

            async.waterfall([
                function(aggregateCallback) {

                    Entry
                    .aggregate([
                        {$match: {header: mongoose.Types.ObjectId(req.params.targetid)}},
                        {$group: {_id: "$bibliography_prime", count: {$sum: 1}}}
                    ])
                    .exec(function(err, aggregateResults) {
                        aggregateCallback(null, aggregateResults);
                    });
                }, function(aggregateResults, aggregateCallback) {

                    BibPrime
                    .populate(aggregateResults, {path: "_id"},
                    function(err, populatedBibPrimes) {
                        // console.log(populatedHeaders[0].url);
                        aggregateCallback(null, populatedBibPrimes);
                    });
                }
            ], function(err, populatedWithCounts) {
                // console.log(populatedWithCounts);
                callback(null, populatedWithCounts);
            });
        }
    }, function(err, results) {

        // console.log(results.records);

        var newStepSize = req.query.stepSize == null ? STEPSIZE : results.records.length;

        res.render("search", helpers.formatRender(err,
                                            activepage,
                                            newStepSize,
                                            req.query,
                                            pageNo,
                                            helpers.tempFormatEntryFromHeader(results.records.sort(sortByTitleBibPrime).slice((pageNo - 1) * newStepSize, pageNo * newStepSize)),
                                            results.records.length,
                                            {title: results.selectedtext.text_title, url: results.selectedtext.url},
                                            {title: "", url: ""}));
    });
}

exports.getPrintSourcesForTargetText = function(req, res) {

    // res.send("NOT IMPLEMENTED " + req.params.targetid);
    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        selectedtext: function(callback) {
            helpers.documentById(Header, req.params.targetid).exec(callback);
        },
        records: function(callback) {

            async.waterfall([
                function(aggregateCallback) {

                    Entry
                    .aggregate([
                        {$match: {header: mongoose.Types.ObjectId(req.params.targetid)}},
                        {$group: {_id: "$bibliography_prime", count: {$sum: 1}}}
                    ])
                    .exec(function(err, aggregateResults) {
                        aggregateCallback(null, aggregateResults);
                    });
                }, function(aggregateResults, aggregateCallback) {

                    BibPrime
                    .populate(aggregateResults, {path: "_id"},
                    function(err, populatedBibPrimes) {
                        // console.log(populatedHeaders[0].url);
                        aggregateCallback(null, populatedBibPrimes);
                    });
                }
            ], function(err, populatedWithCounts) {
                // console.log(populatedWithCounts);
                callback(null, populatedWithCounts);
            });
        }
    }, function(err, results) {

        // console.log(results.records);

        var newStepSize = req.query.stepSize == null ? STEPSIZE : results.records.length;

        res.render("printtexts", helpers.formatRender(err,
                                            activepage,
                                            newStepSize,
                                            req.query,
                                            pageNo,
                                            helpers.tempFormatEntryFromHeader(results.records.sort(sortByTitleBibPrime)),
                                            results.records.length,
                                            {title: results.selectedtext.text_title, url: results.selectedtext.url},
                                            {title: "", url: ""}));
    });
}

exports.getCSVSourcesForTargetText = function(req, res) {

    // res.send("NOT IMPLEMENTED " + req.params.targetid);
    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        selectedtext: function(callback) {
            helpers.documentById(Header, req.params.targetid).exec(callback);
        },
        records: function(callback) {

            async.waterfall([
                function(aggregateCallback) {

                    Entry
                    .aggregate([
                        {$match: {header: mongoose.Types.ObjectId(req.params.targetid)}},
                        {$group: {_id: "$bibliography_prime", count: {$sum: 1}}}
                    ])
                    .exec(function(err, aggregateResults) {
                        aggregateCallback(null, aggregateResults);
                    });
                }, function(aggregateResults, aggregateCallback) {

                    BibPrime
                    .populate(aggregateResults, {path: "_id"},
                    function(err, populatedBibPrimes) {
                        // console.log(populatedHeaders[0].url);
                        aggregateCallback(null, populatedBibPrimes);
                    });
                }
            ], function(err, populatedWithCounts) {
                // console.log(populatedWithCounts);
                callback(null, populatedWithCounts);
            });
        }
    }, function(err, results) {

        // console.log(results.records);

        var newStepSize = req.query.stepSize == null ? STEPSIZE : results.records.length;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=target_texts.csv");

        stringify(helpers.formatCSVSourcesFromTarget(results.records.sort(sortByTitleBibPrime)), {header: true}).pipe(res);
    });
}

exports.getTargetsForSourceText = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        selectedtext: function(callback) {
            helpers.documentById(BibPrime, req.params.sourceid).exec(callback);
        },
        records: function(callback) {
            // helpers.documentSearch(Entry, {bibliography_prime: req.params.sourceid}, STEPSIZE, pageNo - 1).populate("header").exec(callback);

            async.waterfall([
                function(aggregateCallback) {

                    Entry
                    .aggregate([
                        {$match: {bibliography_prime: mongoose.Types.ObjectId(req.params.sourceid)}},
                        {$group: {_id: "$header", count: {$sum: 1}}}
                    ])
                    .exec(function(err, aggregateResults) {
                        aggregateCallback(null, aggregateResults);
                    });
                }, function(aggregateResults, aggregateCallback) {

                    Header
                    .populate(aggregateResults, {path: "_id"},
                    function(err, populatedHeaders) {
                        // console.log(populatedHeaders[0].url);
                        aggregateCallback(null, populatedHeaders);
                    });
                }
            ], function(err, populatedWithCounts) {
                // console.log(populatedWithCounts);
                callback(null, populatedWithCounts);
            });
        }
    }, function(err, results) {

        if (err) throw err;

        // console.log(results.records);

        var newStepSize = req.query.stepSize == null ? STEPSIZE : results.records.length;

        res.render("search", helpers.formatRender(err,
                                            activepage,
                                            newStepSize,
                                            req.query,
                                            pageNo,
                                            helpers.tempFormatEntryFromBib(results.records.sort(sortByNewTitleHeader).slice((pageNo - 1) * newStepSize, pageNo * newStepSize)),
                                            results.records.length,
                                            {title: "", url: ""},
                                            {title: results.selectedtext.title, url: results.selectedtext.url}));
    });
}

exports.getPrintTargetsForSourceText = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        selectedtext: function(callback) {
            helpers.documentById(BibPrime, req.params.sourceid).exec(callback);
        },
        records: function(callback) {
            // helpers.documentSearch(Entry, {bibliography_prime: req.params.sourceid}, STEPSIZE, pageNo - 1).populate("header").exec(callback);

            async.waterfall([
                function(aggregateCallback) {

                    Entry
                    .aggregate([
                        {$match: {bibliography_prime: mongoose.Types.ObjectId(req.params.sourceid)}},
                        {$group: {_id: "$header", count: {$sum: 1}}}
                    ])
                    .exec(function(err, aggregateResults) {
                        aggregateCallback(null, aggregateResults);
                    });
                }, function(aggregateResults, aggregateCallback) {

                    Header
                    .populate(aggregateResults, {path: "_id"},
                    function(err, populatedHeaders) {
                        // console.log(populatedHeaders[0].url);
                        aggregateCallback(null, populatedHeaders);
                    });
                }
            ], function(err, populatedWithCounts) {
                // console.log(populatedWithCounts);
                callback(null, populatedWithCounts);
            });
        }
    }, function(err, results) {

        if (err) throw err;

        // console.log(results.records);

        var newStepSize = req.query.stepSize == null ? STEPSIZE : results.records.length;

        res.render("printtexts", helpers.formatRender(err,
                                            activepage,
                                            newStepSize,
                                            req.query,
                                            pageNo,
                                            helpers.tempFormatEntryFromBib(results.records.sort(sortByNewTitleHeader)),
                                            results.records.length,
                                            {title: "", url: ""},
                                            {title: results.selectedtext.title, url: results.selectedtext.url}));
    });
}

exports.getCSVTargetsForSourceText = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        selectedtext: function(callback) {
            helpers.documentById(BibPrime, req.params.sourceid).exec(callback);
        },
        records: function(callback) {
            // helpers.documentSearch(Entry, {bibliography_prime: req.params.sourceid}, STEPSIZE, pageNo - 1).populate("header").exec(callback);

            async.waterfall([
                function(aggregateCallback) {

                    Entry
                    .aggregate([
                        {$match: {bibliography_prime: mongoose.Types.ObjectId(req.params.sourceid)}},
                        {$group: {_id: "$header", count: {$sum: 1}}}
                    ])
                    .exec(function(err, aggregateResults) {
                        aggregateCallback(null, aggregateResults);
                    });
                }, function(aggregateResults, aggregateCallback) {

                    Header
                    .populate(aggregateResults, {path: "_id"},
                    function(err, populatedHeaders) {
                        // console.log(populatedHeaders[0].url);
                        aggregateCallback(null, populatedHeaders);
                    });
                }
            ], function(err, populatedWithCounts) {
                // console.log(populatedWithCounts);
                callback(null, populatedWithCounts);
            });
        }
    }, function(err, results) {

        if (err) throw err;

        var newStepSize = req.query.stepSize == null ? STEPSIZE : results.records.length;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=source_texts.csv");

        stringify(helpers.formatCSVTargetsFromSource(results.records.sort(sortByNewTitleHeader)), {header: true}).pipe(res);
    });
}

exports.printEntries = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        targetInfo: function(callback) {
            Header
            .findById(req.params.targetid)
            .exec(callback);
        },
        sourceInfo: function(callback) {
            BibPrime
            .findById(req.params.sourceid)
            .exec(callback);
        },
        entries: function(callback){
            //show all
            helpers.documentSearch(Entry, {header: req.params.targetid, bibliography_prime: req.params.sourceid}, -1, pageNo - 1, {}).populate("bibliography_prime").exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        // console.log(results)

        var renderedInfo = helpers.formatRender(err,
                        activepage,
                        STEPSIZE,
                        req.query,
                        pageNo,
                        helpers.formatEntries(results.entries),
                        results.entries.length,
                        {title: results.targetInfo.text_title, author: results.targetInfo.text_author, edition: results.targetInfo.text_edition, contributor: results.targetInfo.contributor, date: moment(results.targetInfo.date).format("DD/MM/YYYY"), url: results.targetInfo.url},
                        {title: results.sourceInfo.title, author: results.sourceInfo.author, edition: results.sourceInfo.db_edition, url: results.sourceInfo.url});

        renderedInfo.citeinfo = helpers.formatCiteInfo(results.targetInfo);

        console.log(renderedInfo);

        res.render("printentries", renderedInfo);
    });
}

exports.csvEntries = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    async.parallel({
        targetInfo: function(callback) {
            Header
            .findById(req.params.targetid)
            .exec(callback);
        },
        sourceInfo: function(callback) {
            BibPrime
            .findById(req.params.sourceid)
            .exec(callback);
        },
        entries: function(callback){
            //all records
            helpers.documentSearch(Entry, {header: req.params.targetid, bibliography_prime: req.params.sourceid}, -1, pageNo - 1, {}).populate("bibliography_prime").exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=entries.csv");

        stringify(helpers.formatCSVEntries(results.entries), {header: true}).pipe(res);
    });
}

//Helpers
function queryBuilderHeader(title, author, edition, reference) {

    var query = {};

    if (title != null && title != "") {
        query.text_title = new RegExp(escapeRegex(title), "i");
    }
    if (author != null && author != "") {
        query.text_author = new RegExp(escapeRegex(author), "i");
    }
    if (edition != null && edition != "") {
        query.text_edition =  new RegExp(escapeRegex(edition), "i");
    }
    if (reference != null && reference != "") {
        query.text_reference = new RegExp(escapeRegex(reference), "i");
    }

    return query;
}

function queryBuilderBibPrime(title, author, edition, reference) {

    var query = {};

    if (title != null && title != "") {
        query.title = new RegExp(escapeRegex(title), "i");
    }
    if (author != null && author != "") {
        query.author = new RegExp(escapeRegex(author), "i");
    }
    if (edition != null && edition != "") {
        query.db_edition =  new RegExp(escapeRegex(edition), "i");
    }

    return query;
}

function sortByTitleBibPrime(e1, e2) {
    return e1._id.title.localeCompare(e2._id.title);
}

function sortByAuthorBibPrime(e1, e2) {

    if (e1._id.bs_number != null && e2._id.bs_number != null) {

        return e1._id.bs_number - e2._id.bs_number;
    }
    return e1._id.author.localeCompare(e2._id.author);
}

function sortByAuthorHeader(e1, e2) {

    return e1._id.text_author.localeCompare(e2._id.text_author);
}

function sortByNewTitleHeader(e1, e2) {

    return e1._id.new_title.localeCompare(e2._id.new_title);
}

//https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
