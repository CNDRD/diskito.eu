import { c, supabase, UUID } from './main.js';

toggleLoggedIn(!!UUID);

$('.login-btn:not(.logout)').click(() => supabase.auth.signInWithOAuth({ provider: 'discord' }));
$('.login-btn.logout').click(() => { supabase.auth.signOut(); toggleLoggedIn(false); });

function toggleLoggedIn(inOut) {
    if (inOut) {
        $(".login-btn").addClass("logout").text("Logout");
        $('html').attr('data-logged-in', true);
        if (!$('nav > .links a[href="/gamble"]').length) {
            $('<a href="/gamble">Gamble</a>').insertAfter('nav > .links [href="/quotes"]');
        }
    }
    else {
        $(".login-btn").removeClass("logout").text("Login");
        $('html').attr('data-logged-in', false);
        $('nav > .links a[href="/gamble"]').remove();

        let loginOnlyPages = ['gamble'];
        if (loginOnlyPages.includes(window.location.pathname.split('/')[1])) {
            window.location.href = '/';
        }
    }
};

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') { toggleLoggedIn(false); }
    else if (event === 'SIGNED_IN') { toggleLoggedIn(true); }
});



// Mobile navbar toggle
$(".toggle-mnu").click(function() {
    $(this).toggleClass("on");
    $("nav").toggleClass("show-mobile-menu");
    $("body").toggleClass("overflow-hidden");
    return false;
});
