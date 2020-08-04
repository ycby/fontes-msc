$(document).ready(function() {

    $(".accordion").click(accordionActive);
});


function accordionActive() {

    $(this).toggleClass("accordion-active");
    $(this).find(".entry-arrow").toggleClass("rotated")
    $(this).next().slideToggle(200);
}
