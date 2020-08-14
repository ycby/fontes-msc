$(document).ready(function() {

    //navigation to pinned entries
    $("#nav-pinned").click(function(event) {
        moveToPinned(event, "");
    });

    //responsive mobile
    $("#hamburger-menu").click(toggleMenu);

    //for placement of the footer
    // console.log($(window).height());
    // console.log($("body").height());
    var heightDiff = $(window).height() - $("body").height();
    // var defaultMargin = $(window).height() * 0.05;
    if (heightDiff > 0) {
        $("footer").css("margin-top", parseInt($("footer").css("margin-top"), 10) + heightDiff);
    }
});

//for sending post to server for pinned entries
function moveToPinned(event, type) {

    var pinnedEntries = JSON.parse(localStorage.getItem("pinned-entries"));

    event.preventDefault();

    if (pinnedEntries == null) {

        //if null, create empty array
        pinnedEntries = [];
    }

    //always submit the form

    var fakeform = $("<form method='post' action='/pinned/" + type +"'></form>");

    fakeform.append("<input type='hidden' name='pinnedentries' value='" + JSON.stringify(pinnedEntries) + "'>");

    $("body").append(fakeform);
    fakeform.submit();
}


//for responsive menu
function toggleMenu() {

    $("nav").toggleClass("responsive");
}
