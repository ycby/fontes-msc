var async = require("async");
var mongoose = require("mongoose")
var helpers = require("./helpers")
var moment = require("moment")
var stringify = require("csv-stringify")

var BibPrime = require("../models/bibprime");
var BibSec = require("../models/bibsec");
var BibText = require("../models/bibtext");
var Entry = require("../models/entry");
var Header = require("../models/header");

var activepage = "bibliography";

const STEPSIZE = 30;
const ENTRYSTEPSIZE = 10;

exports.index = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    if (req.query.texttype == "source") {

        getPrimaryBibliographies(pageNo, "bibliographyprimary", req.query, res);
    } else if (req.query.texttype == "secondary") {

        getSecondaryBibliographies(pageNo, "bibliographysecondary", req.query, res);
    } else {

        getTargetBibliographies(pageNo, "bibliographytarget", req.query, res);
    }
}

exports.csvdownload = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    if (req.query.texttype == "source") {

        getPrimaryBibliographiesCSV(pageNo, "bibliographyprimary", req.query, res);
    } else if (req.query.texttype == "secondary") {

        getSecondaryBibliographiesCSV(pageNo, "bibliographysecondary", req.query, res);
    } else {

        getTargetBibliographiesCSV(pageNo, "bibliographytarget", req.query, res);
    }
}

exports.print = function(req, res) {

    var pageNo = req.query.pageNo != null? req.query.pageNo : 1;

    if (req.query.texttype == "source") {

        getPrimaryBibliographiesPrint(pageNo, "printtexts", req.query, res);
    } else if (req.query.texttype == "secondary") {

        getSecondaryBibliographiesPrint(pageNo, "bibliographysecondaryprint", req.query, res);
    } else {

        getTargetBibliographiesPrint(pageNo, "printtexts", req.query, res);
    }
}

function determineStepSize(suppliedStepSize) {
    if (suppliedStepSize == null) {
        return STEPSIZE;
    }
    else if (isNaN(suppliedStepSize)) {
        var stepSize = parseInt(suppliedStepSize);
        if (isNaN(stepSize)) {
            return STEPSIZE;
        }
        else {
            return stepSize;
        }
    }
    else {
        return suppliedStepSize;
    }
}

function getPrimaryBibliographies(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderTarget(reqQuery.title, reqQuery.author, reqQuery.edition);

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

function getTargetBibliographies(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderTarget(reqQuery.title, reqQuery.author, reqQuery.edition);

    //force reqQuery to init on target-bibliography
    reqQuery.texttype = "target";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibText, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibText, query, reqQuery.stepSize != null ? reqQuery.stepSize : STEPSIZE, pageNo - 1, {title: 1}).exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.render(pageToRender, helpers.formatRender(err,
                                            activepage,
                                            reqQuery.stepSize == null ? STEPSIZE : results.recordcount,
                                            reqQuery,
                                            pageNo,
                                            helpers.formatTargetBibliographies(results.records),
                                            results.recordcount,
                                            {title: "", url: ""},
                                            {title: "", url: ""}));
    });
}

function getSecondaryBibliographies(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderSecondary(reqQuery.title);

    //force reqQuery to init on target-bibliography
    reqQuery.texttype = "secondary";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibSec, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibSec, query, reqQuery.stepSize != null ? reqQuery.stepSize : STEPSIZE, pageNo - 1, {name_and_year: 1}).exec(callback);
        }
    }, function(err, results) {
        //console.log(results.records);

        if (err) throw err;

        res.render(pageToRender, helpers.formatRender(err,
                                            activepage,
                                            reqQuery.stepSize == null ? STEPSIZE : results.recordcount,
                                            reqQuery,
                                            pageNo,
                                            helpers.formatSecondaryBibliographies(results.records),
                                            results.recordcount,
                                            {title: "", url: ""},
                                            {title: "", url: ""}));
    });
}


//CSV

function getPrimaryBibliographiesCSV(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderTarget(reqQuery.title, reqQuery.author, reqQuery.edition);

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibPrime, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibPrime, query, -1, pageNo - 1, {title: 1}).exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=bibliographies_source.csv");

        stringify(helpers.formatBibPrime(results.records), {header: true}).pipe(res);
    });
}

function getTargetBibliographiesCSV(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderTarget(reqQuery.title, reqQuery.author, reqQuery.edition);

    //force reqQuery to init on target-bibliography
    reqQuery.texttype = "target";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibText, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibText, query, -1, pageNo - 1, {new_title: 1}).exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=bibliographies_target.csv");

        stringify(helpers.formatTargetBibliographies(results.records), {header: true}).pipe(res);
    });
}

function getSecondaryBibliographiesCSV(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderSecondary(reqQuery.title);

    //force reqQuery to init on target-bibliography
    reqQuery.texttype = "secondary";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibSec, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibSec, query, -1, pageNo - 1).exec(callback);
        }
    }, function(err, results) {
        //console.log(results.records);
        if (err) throw err;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=bibliographies_secondary.csv");

        stringify(helpers.formatSecondaryBibliographies(results.records), {header: true}).pipe(res);
    });
}

//Print

function getPrimaryBibliographiesPrint(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderTarget(reqQuery.title, reqQuery.author, reqQuery.edition);

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibPrime, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibPrime, query, -1, pageNo - 1, {title: 1}).exec(callback);
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

function getTargetBibliographiesPrint(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderTarget(reqQuery.title, reqQuery.author, reqQuery.edition);

    //force reqQuery to init on target-bibliography
    reqQuery.texttype = "target";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibText, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibText, query, -1, pageNo - 1, {new_title: 1}).exec(callback);
        }
    }, function(err, results) {

        if (err) throw err;

        res.render(pageToRender, helpers.formatRender(err,
                                            activepage,
                                            reqQuery.stepSize == null ? STEPSIZE : results.recordcount,
                                            reqQuery,
                                            pageNo,
                                            helpers.formatTargetBibliographies(results.records),
                                            results.recordcount,
                                            {title: "", url: ""},
                                            {title: "", url: ""}));
    });
}

function getSecondaryBibliographiesPrint(pageNo, pageToRender, reqQuery, res) {

    var query = queryBuilderSecondary(reqQuery.title);

    //force reqQuery to init on target-bibliography
    reqQuery.texttype = "secondary";

    async.parallel({
        recordcount: function(callback) {
            helpers.documentCount(BibSec, query, callback);
        },
        records: function(callback) {
            helpers.documentSearch(BibSec, query, -1, pageNo - 1).exec(callback);
        }
    }, function(err, results) {
        //console.log(results.records);

        if (err) throw err;

        res.render(pageToRender, helpers.formatRender(err,
                                            activepage,
                                            reqQuery.stepSize == null ? STEPSIZE : results.recordcount,
                                            reqQuery,
                                            pageNo,
                                            helpers.formatSecondaryBibliographies(results.records),
                                            results.recordcount,
                                            {title: "", url: ""},
                                            {title: "", url: ""}));
    });
}

function queryBuilderTarget(title, author, edition) {

    var query = {};

    if (title != null && title != "") {
        query.title = new RegExp(helpers.escapeRegex(title), "i");
    }
    if (author != null && author != "") {
        query.author = new RegExp(helpers.escapeRegex(author), "i");
    }
    if (edition != null && edition != "") {
        query.db_edition =  new RegExp(helpers.escapeRegex(edition), "i");
    }

    return query;
}

function queryBuilderSecondary(title) {

    var query = {};

    if (title != null && title != "") {
        query.name_and_year = new RegExp(helpers.escapeRegex(title), "i");
    }

    return query;
}
