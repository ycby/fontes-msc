$(document).ready(function() {

    var paginationElements = $(".pagination").find("a");

    paginationElements.each(setPaginationLinks);
});


function setPaginationLinks() {

    var searchstring = "?text-type=target-text&title=&author=&edition=&reference=";
    var href = window.location.href;
    var pagiHref = $(this).attr("href");
    var shownText = $(this).text();

    if (href.search("\\?") == -1) {
        href += searchstring;
    }

    var pageNoExist = href.search(/(pageNo=[0-9]+)/);

    if (shownText == "Next »") {
        if (pageNoExist == -1) {
            $(this).attr("href", href + "&pageNo=2");
        } else {
            var extra = parseInt(href.substring(pageNoExist).substring(7)) + 1;
            $(this).attr("href", href.replace(/(&pageNo=[0-9]+)/, "&pageNo=" + extra));
        }
    } else if (shownText == "« Prev") {
        //no need to worry if pageno isnt in url because that means its on the first page
        //if on other pages
        var extra = parseInt(href.substring(pageNoExist).substring(7)) - 1;
        $(this).attr("href", href.replace(/(&pageNo=[0-9]+)/, "&pageNo=" + extra));
    } else {
        if (pageNoExist == -1) {
            $(this).attr("href", href + "&pageNo=" + shownText);
        } else {
            $(this).attr("href", href.replace(/(&pageNo=[0-9]+)/, "&pageNo=" + shownText));
        }
    }
}
