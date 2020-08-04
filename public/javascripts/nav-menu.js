$(document).ready(function() {

    $("#hamburger-menu").click(toggleMenu);
});

function toggleMenu() {

    $("nav").toggleClass("responsive");
}
