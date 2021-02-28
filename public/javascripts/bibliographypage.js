$(document).ready(function() {

    //shrink search
    $("#search-container-collapser").click(shrinkSearch);

    //swap page
    $("input[type=radio][name=texttype]").change(function() {
        $("#title").val("");
        $("#author").val("");
        $("#edition").val("");
        $("#reference").val("");
        sessionStorage.setItem("title", "")
        sessionStorage.setItem("author", "")
        sessionStorage.setItem("edition", "")
        sessionStorage.setItem("reference", "")
        $("form").submit();
    });

    //print records & csv
    var queryIndex = window.location.href.indexOf("?");

    if (queryIndex != -1) {

        var queryString = window.location.href.substring(window.location.href.indexOf("?"));
        var printQuery = $("#print-records").attr("href") + queryString;
        var downloadQuery = $("#download-records").attr("href") + queryString;
        $("#print-records").attr("href", printQuery);
        $("#download-records").attr("href", downloadQuery);
    }

    //see all records
    $("#all-records").attr("href", replaceAllRecordsHref());

    //bibliography modals
    var bibliographyRows = $(".bibliography-row");
    var modals = $(".modal");
    var modalCloses = $(".modal-close");

    bibliographyRows.click(function(event) {
        modals.eq(getBibliographyRowNumber($(this))).show();
    });

    modalCloses.click(function() {
        modals.hide();
    });

    $(window).click(function(e) {
        console.log(e.target);
        if (e.target.className.match(/(modal)/)) {
            modals.hide();
        }
    });
});


function getBibliographyRowNumber(bibliographyRow) {

    return parseInt(bibliographyRow.attr("id").replace("bibliography-row-", ""));
}

function shrinkSearch() {
    console.log("clicked");
    $("#advanced-search").slideToggle(200, "linear");
    $(this).toggleClass("flipped");
}

function replaceAllRecordsHref() {

    var currentHref = window.location.href;
    var hasQuery = true;

    if (!currentHref.includes("?")) {
        currentHref += "?";
        hasQuery = false;
    }

    if (currentHref.includes("pageNo=")) {

        currentHref = currentHref.replace(/pageNo=\d/, "pageNo=1");
    } else {
        if (hasQuery) currentHref += "&";
        currentHref += "pageNo=1";
    }

    if (currentHref.includes("stepSize=")) {

        currentHref = currentHref.replace(/stepSize=\d/, "stepSize=-1");
    } else {

        currentHref += "&stepSize=-1"
    }

    return currentHref;
}
