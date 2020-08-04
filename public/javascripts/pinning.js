$(document).ready(function() {

    $(".pin").click(toggleEntryInPinned);
});

function toggleEntryInPinned() {

    $(this).toggleClass("pinned");
    var id = $(this).parent().next().find("._id").text();
    var pinnedEntries = JSON.parse(localStorage.getItem("pinned-entries"));

    if ($(this).hasClass("pinned")) {

        $(this).text("pinned");
        //add to the pinned list

        if (pinnedEntries == null) {

            localStorage.setItem("pinned-entries", JSON.stringify([id]));
        } else {

            pinnedEntries.push(id);
            localStorage.setItem("pinned-entries", JSON.stringify(pinnedEntries));
        }
    } else {

        $(this).text("pin");
        //remove from the pinned list
        // console.log(pinnedEntries)
        if (pinnedEntries != null) {

            var removeIndex = pinnedEntries.indexOf(id);

            if (removeIndex != -1) {
                pinnedEntries.splice(removeIndex, 1);
                localStorage.setItem("pinned-entries", JSON.stringify(pinnedEntries));
            }
        }
    }
}
