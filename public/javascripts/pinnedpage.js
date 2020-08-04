$(document).ready(function() {

    //pinning entries
    $(".pin").click(toggleEntryInPinned);
    $(".pin").each(setPinnedIfPinned);

    //open and close accordions
    $(".accordion").click(accordionActive);
});


// accordion active
function accordionActive(e) {

    if (!e.target.classList.contains("pin")) {
        $(this).toggleClass("accordion-active");
        $(this).find(".entry-arrow").toggleClass("rotated")
        $(this).next().slideToggle(200);
    }
}

// pinning entries
function toggleEntryInPinned(event) {

    $(this).toggleClass("pinned");
    var id = $(this).parent().next().find("._id").text();
    var pinnedEntries = JSON.parse(localStorage.getItem("pinned-entries"));

    if ($(this).hasClass("pinned")) {
        //add to the pinned list

        if (pinnedEntries == null) {

            localStorage.setItem("pinned-entries", JSON.stringify([id]));
        } else {

            pinnedEntries.push(id);
            localStorage.setItem("pinned-entries", JSON.stringify(pinnedEntries));
        }
    } else {

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

//for making records which were already pinned, pinned on page load
function setPinnedIfPinned() {

    if (JSON.parse(localStorage.getItem("pinned-entries")).includes($(this).parent().next().find("._id").text())) {
        $(this).toggleClass("pinned");
    }
}
