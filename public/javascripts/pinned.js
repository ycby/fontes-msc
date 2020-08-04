$(document).ready(function() {

    $("#nav-pinned").click(function(event) {
        moveToPinned(event);
    });
});

function moveToPinned(event) {

    var pinnedEntries = JSON.parse(localStorage.getItem("pinned-entries"));

    event.preventDefault();

    if (pinnedEntries == null) {

        //if null, create empty array
        pinnedEntries = [];
    }

    //always submit the form

    var fakeform = $("<form method='post' action='/pinned'></form>");

    fakeform.append("<input type='hidden' name='pinnedentries' value='" + JSON.stringify(pinnedEntries) + "'>");

    $("body").append(fakeform);
    fakeform.submit();
}
