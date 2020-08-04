$(document).ready(function() {

    var citeButtons = $(".cite-button");
    var citeModals = $(".modal.cite");
    var citeModalCloses = $(".modal-close");

    citeButtons.click(function() {
        citeModals.eq(getCiteButtonNumber($(this))).show();
    });

    citeModalCloses.click(function() {
        citeModals.hide();
    });

    $(window).click(function(e) {
        if (e.target.className.match(/(modal )/)) {
            citeModals.hide();
        }
    });
});


function getCiteButtonNumber(citeButton) {

    return parseInt(citeButton.attr("id").replace("cite-button-", ""));
}
