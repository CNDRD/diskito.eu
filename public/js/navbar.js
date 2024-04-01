import { c, supabase, UUID } from './main.js';

toggleLoggedIn(!!UUID);

$('.login-btn:not(.logout)').click(() => supabase.auth.signInWithOAuth({ provider: 'discord' }));
$('.login-btn.logout').click(() => { supabase.auth.signOut(); toggleLoggedIn(false); });

function toggleLoggedIn(inOut) {
    if (inOut) {
        $(".login-btn").addClass("logout").text("Logout");
        $('html').attr('data-logged-in', true);
    }
    else {
        $(".login-btn").removeClass("logout").text("Login");
        $('html').attr('data-logged-in', false);
    }
};





// Mobile navbar toggle
$(".toggle-mnu").click(function() {
    $(this).toggleClass("on");
    $("nav").toggleClass("show-mobile-menu");
    $("body").toggleClass("overflow-hidden");
    return false;
});
