var moment = require("moment")

var Sigil = require("../models/sigil");

var sigilInterpretationMap = new Map();
// sigilInterpretationMap.set("S", "Single Immediate Source");
// sigilInterpretationMap.set("2", "Probable");

Sigil
.find()
.exec(function(err, sigils) {

    if (err) throw err;

    sigils.forEach((sigil) => {

        sigilInterpretationMap.set(sigil.sigil, sigil.meaning);
    });
});

function formatRender(err, activepage, stepsize, reqQuery, pageNo, results, resultsNo, targetText, sourceText) {

    if (err) throw err;

    var pages = Math.floor(resultsNo / stepsize);
    var excess = resultsNo % stepsize;

    // console.log(reqQuery);
    if (excess > 0) {
        pages += 1;
    }

    var recordCountContainer = {
        totalrecords: resultsNo,
        recordsupperlimit: pageNo != pages ? stepsize * pageNo : resultsNo,
        recordslowerlimit: 1 + stepsize * (pageNo - 1),
        totalpages: pages,
        currentpage: pageNo
    }

    var searchQuery = {
        texttype: reqQuery.texttype,
        title: reqQuery.title,
        author: reqQuery.author,
        edition: reqQuery.edition,
        reference: reqQuery.reference
    }

    var selectedTexts = {
        targettext: targetText,
        sourcetext: sourceText
    }

    return {activepage: activepage,
         searchquery: searchQuery,
         tabledata: results,
         recordcount: recordCountContainer,
         selectedtexts: selectedTexts};
}

function formatHeader(records) {

    var formattedText = [];

    records.forEach((record) => {

        formattedText.push({
            title: record.text_title,
            author: record.text_author,
            edition: record.text_edition,
            url: record.url
        });
    });

    return formattedText;
}

function formatHeaderCSV(records) {

    var formattedText = [];

    records.forEach((record) => {

        formattedText.push({
            text_reference: record.text_reference,
            title: record.text_title,
            author: record.text_author,
            edition: record.text_edition,
            contributor: record.contributor,
            bibliography: record.bibliography,
            date: moment(record.date).format("DD/MM/YYYY"),
            updated: moment(record.updated).format("DD/MM/YYYY")
        });
    });

    return formattedText;
}

function formatBibPrime(records) {

    var formattedText = [];

    records.forEach((record) => {

        formattedText.push({
            title: record.title,
            author: record.author,
            edition: record.db_edition,
            url: record.url
        });
    });

    return formattedText;
}

function formatBibPrimeCSV(records) {

    var formattedText = [];

    records.forEach((record) => {

        formattedText.push({
            title: record.title,
            author: record.author,
            edition: record.db_edition,
            bhl_number: record.bhl_number,
            reference_comment: record.reference_comment,
            publication_details: record.publication_details,
            date: moment(record.date).format("DD/MM/YYYY"),
            updated: moment(record.updated).format("DD/MM/YYYY")
        });
    });

    return formattedText;
}

function tempFormatEntryFromBib(entries) {

    var formattedEntries = [];

    entries.forEach((entry) => {

        formattedEntries.push({title: entry._id.text_title, author: entry._id.text_author, edition: entry._id.text_edition, count: entry.count, url: "targettext/" + entry._id._id + "/"});
    });

    return formattedEntries;
}

function formatCSVTargetsFromSource(records) {

    var formattedEntries = [];

    records.forEach((record) => {

        formattedEntries.push({
            text_reference: record._id.text_reference,
            title: record._id.text_title,
            author: record._id.text_author,
            edition: record._id.text_edition,
            contributor: record._id.contributor,
            bibliography: record._id.bibliography,
            date: moment(record._id.date).format("DD/MM/YYYY"),
            updated: moment(record._id.updated).format("DD/MM/YYYY")
        });
    });

    return formattedEntries;
}

function formatCSVSourcesFromTarget(records) {

    var formattedEntries = [];

    records.forEach((record) => {

        formattedEntries.push({
            title: record._id.title,
            author: record._id.author,
            edition: record._id.db_edition,
            bhl_number: record._id.bhl_number,
            reference_comment: record._id.reference_comment,
            publication_details: record._id.publication_details,
            date: moment(record._id.date).format("DD/MM/YYYY"),
            updated: moment(record._id.updated).format("DD/MM/YYYY")
        });
    });

    return formattedEntries;
}

function tempFormatEntryFromHeader(entries) {

    var formattedEntries = [];

    entries.forEach((entry) => {

        formattedEntries.push({title: entry._id.title, author: entry._id.author, edition: entry._id.db_edition, count: entry.count, url: "sourcetext/" + entry._id._id + "/"});
    });

    return formattedEntries;
}

function formatEntries(entries) {

    var formattedEntries = []

    entries.forEach((entry, i) => {

        var formattedEntry = {
            _id: entry._id,
            textreference: entry.text_reference != "" ? entry.text_reference : "N/A",
            entryreference: entry.entry_reference != "" ? entry.entry_reference : "N/A",
            sourcereference: entry.source_reference != "" ? entry.source_reference : "N/A",
            sigil: entry.sigil != "" ? entry.sigil : "N/A",
            siglainterpretation: interpretSigla(entry.sigil),
            sourcetext: entry.bibliography_prime.title != "" ? entry.bibliography_prime.title : "N/A",
            sourceauthor: entry.bibliography_prime.author != "" ? entry.bibliography_prime.author : "N/A",
            sourceedition: entry.source_edition != "" ? entry.source_edition : "N/A",
            sourcelocation: entry.source_location != "" ? entry.source_location : "N/A",
            sourcequote: entry.source_quote != "" ? entry.source_quote : "N/A",
            entrylocation: entry.entry_location != "" ? entry.entry_location : "N/A",
            entryquote: entry.entry_quote != "" ? entry.entry_quote : "N/A",
            bhlnumber: entry.bhl_number != "" ? entry.bhl_number : "N/A",
            comment: entry.comment != "" ? entry.comment : "N/A",
            bibliography: entry.bibliography != "" ? entry.bibliography : "N/A",
            manuscript: entry.manuscript != "" ? entry.manuscript : "N/A",
            date: moment.utc(entry.date).format("DD/MM/YYYY"),
            updated: moment.utc(entry.updated).format("DD/MM/YYYY"),
            header: entry.header,
            bibliographyprime: entry.bibliography_prime
        }

        formattedEntries.push(formattedEntry);
    });

    return formattedEntries;
}

function formatCSVEntries(entries) {

    var formattedEntries = []

    entries.forEach((entry, i) => {

        var formattedEntry = {
            text_reference: entry.text_reference,
            entry_reference: entry.entry_reference,
            source_reference: entry.source_reference,
            sigil: entry.sigil,
            sigla_interpretation: interpretSigla(entry.sigil),
            source_text: entry.bibliography_prime.title,
            source_author: entry.bibliography_prime.author,
            source_edition: entry.source_edition,
            source_location: entry.source_location,
            source_quote: entry.source_quote,
            entry_location: entry.entry_location,
            entry_quote: entry.entry_quote,
            bhl_number: entry.bhl_number,
            comment: entry.comment,
            bibliography: entry.bibliography,
            manuscript: entry.manuscript,
            date: moment.utc(entry.date).format("DD/MM/YYYY"),
            updated: moment.utc(entry.updated).format("DD/MM/YYYY")
        }

        formattedEntries.push(formattedEntry);
    });

    return formattedEntries;
}

function formatSuggestions(records) {

    var formattedRecords = []

    records.forEach((record) => {

        formattedRecords.push({
            text_title: record.title,
            text_author: record.author
        });
    });

    return formattedRecords;
}

function formatCiteInfo(header) {

    return {
        contributor: header.contributor,
        title: header.text_title,
        accessed: moment().format("MMMM YYYY")
    };
}

function interpretSigla(sigil) {

    // console.log(sigil);
    var splitSigil = sigil.split(/(MX|MA|M|SX|SA|S|1|2|3|a|o)/).filter(Boolean);
    // console.log(splitSigil);

    var interpretation = []

    splitSigil.forEach((part) => {

        interpretation.push(sigilInterpretationMap.get(part));
    });
    // console.log(interpretation);

    return interpretation;
}

//to DB
function documentSearch(model, query, limiter, offset, sortOrder) {

    var mongooseReq;

    if (limiter != -1) {

        mongooseReq = model.find(query).limit(limiter).skip(limiter * offset).sort(sortOrder);
    } else {

        mongooseReq = model.find(query).sort(sortOrder);
    }

    return mongooseReq;
}

function documentCount(model, query, callback) {

    return model.countDocuments(query, callback);
}

function documentById(model, id) {

    return model.findById(id);
}

module.exports = {
    formatRender,
    formatSuggestions,
    formatHeader,
    formatHeaderCSV,
    formatBibPrime,
    formatBibPrimeCSV,
    tempFormatEntryFromBib,
    tempFormatEntryFromHeader,
    formatCSVTargetsFromSource,
    formatCSVSourcesFromTarget,
    formatEntries,
    formatCSVEntries,
    formatCiteInfo,
    interpretSigla,
    documentSearch,
    documentCount,
    documentById
}
