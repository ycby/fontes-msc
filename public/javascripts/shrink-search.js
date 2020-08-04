$(document).ready(function() {
    $("#search-container-collasper").click(shrinkSearch);
});


function shrinkSearch() {
    $("#advanced-search").slideToggle(200, "linear");
    $(this).toggleClass("flipped");
}
