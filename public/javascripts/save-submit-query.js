$(document).ready(function() {

    $("#title").val(sessionStorage.getItem("title"));
    $("#author").val(sessionStorage.getItem("author"));
    $("#edition").val(sessionStorage.getItem("edition"));
    $("#reference").val(sessionStorage.getItem("reference"));

    $("#search-breadcrumb").text($("#search-breadcrumb").text() + " " + (sessionStorage.getItem("title") != null ? sessionStorage.getItem("title") : ""));
    $("#search-breadcrumb").attr("href", (sessionStorage.getItem("query") != null ? "/search?" + sessionStorage.getItem("query") : "/search"));

    $("#submit-query-button").click(saveQuery);
});

function saveQuery() {
    sessionStorage.setItem("title", $("#title").val());
    sessionStorage.setItem("author", $("#author").val());
    sessionStorage.setItem("edition", $("#edition").val());
    sessionStorage.setItem("reference", $("#reference").val());

    var query = {
        texttype: $("input[name=texttype]:checked").val(),
        title: $("#title").val(),
        author: $("#author").val(),
        edition: $("#edition").val(),
        reference: $("#reference").val()
    }

    sessionStorage.setItem("query", $.param(query));
}
