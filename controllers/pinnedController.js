var async = require("async");
var mongoose = require("mongoose")
var helpers = require("./helpers")

var BibPrime = require("../models/bibprime");
var Entry = require("../models/entry");
var Header = require("../models/header");

exports.getPinned = function(req, res) {
    res.render("pinnedempty", {activepage: "pinned"});
}

exports.populatePinnedEntries = function(req, res) {

    var pinnedEntries = JSON.parse(req.body.pinnedentries);

    // console.log(pinnedEntries);

    if (pinnedEntries.length == 0) {

        //if no entries pinned
        res.render("pinnedempty", {activepage: "pinned"});
    } else {

        //if has entries pinned
        //foreach record, get the information

        var mongooseIds = pinnedEntries.map(x => mongoose.Types.ObjectId(x));

        Entry
        .find({
            "_id": {$in: mongooseIds}
        })
        .populate("header")
        .populate("bibliography_prime")
        .exec(function(err, results) {

            if (err) throw err;

            //got the results now need to group by target text, then source

            var formattedResults = helpers.formatEntries(results);

            // console.log(results);
            var splitByTarget = splitEntriesByTarget(formattedResults);

            console.log(splitByTarget[0][1][0][1]);


            res.render("pinnedrecord", {activepage: "pinned", data: splitByTarget});

        });
    }
}


function splitEntriesByTarget(entries) {

    var splitEntries = new Map();

    entries.forEach((entry) => {

        if (splitEntries.has(entry.header)) {

            splitEntries.get(entry.header).push(entry);
        } else {

            splitEntries.set(entry.header, [entry]);
        }
    });

    return Array.from(splitEntriesBySourceInTarget(splitEntries));
}

function splitEntriesBySourceInTarget(entries) {

    var resultMap = new Map();

    entries.forEach((value, key) => {

        var bibMap = new Map();

        value.forEach((entry) => {

            if (bibMap.has(entry.bibliographyprime)) {

                bibMap.get(entry.bibliographyprime).push(entry);
            } else {

                bibMap.set(entry.bibliographyprime, [entry]);
            }
        });

        resultMap.set(key, Array.from(bibMap));

    });

    return resultMap;
}
