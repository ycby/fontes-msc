$(document).ready(function() {

    var heightDiff = $(window).height() - $("body").height();
    var defaultMargin = $(window).height() * 0.05;
    if (heightDiff > defaultMargin) {
        $("footer").css("margin-top", heightDiff + defaultMargin);
    }
});
