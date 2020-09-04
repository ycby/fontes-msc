$(document).ready(function() {

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
