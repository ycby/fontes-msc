$(document).ready(function() {
    $("#search-container-collapser").click(shrinkSearch);
});


function shrinkSearch() {
    console.log("clicked");
    $("#advanced-search").slideToggle(200, "linear");
    $(this).toggleClass("flipped");
}
