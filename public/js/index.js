
$(".toggle-mnu").click(function() {
    $(this).toggleClass("on");
    $("nav").toggleClass("show-mobile-menu");
    $("body").toggleClass("overflow-hidden");
    return false;
});
