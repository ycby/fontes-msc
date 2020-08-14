$(document).ready(function() {
    var sidebarLinks = $(".sidebar-body").find("a")
    var activeSidebarLink = sidebarLinks.filter(".sidebar-active")

    sidebarLinks.click(function() {
        activeSidebarLink.toggleClass("sidebar-active");
        activeSidebarLink = $(this);
        activeSidebarLink.toggleClass("sidebar-active");
    });
});
