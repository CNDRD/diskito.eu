let theme = localStorage.getItem('theme');
if (theme) { changeTheme(theme); }


$(document).ready(function(){

  $("#menu").click(() => toggleMobileNavbar());
  $("#restt").click(() => toggleMobileNavbar());

  $(".theme-switch").click(function(){
    changeTheme(this.innerHTML);
  });

});


// Should've done this a long time ago...
// Shoves one navbar into all the pages
$.get("/resources/html/navbar-links.html", (data) => {
  $(data).insertBefore("#mobile-invite-link");
  $(".navigation").append(data);
});


function toggleMobileNavbar() {
  $("#hidden").slideToggle(150);
  $("#restt").fadeToggle(150);
};

function changeTheme(toWhat) {
  
  switch ( toWhat ) {
    case "☀️":
    case "Light Mode":
      $("#theme-switch").text("🌑");
      $("#mobile-theme-switch").text("Dark Mode");
      localStorage.setItem("theme", "☀️");
      document.documentElement.style.setProperty("--background-color", "hsl(46, 100%, 97%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(212, 33%, 23%)");
      $("html").removeClass("dark-mode");
      break;
    case "🌑":
    case "Dark Mode":
      $("#theme-switch").text("☀️");
      $("#mobile-theme-switch").text("Light Mode");
      localStorage.setItem("theme", "🌑");
      document.documentElement.style.setProperty("--background-color", "hsl(212, 33%, 23%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(46, 100%, 97%)");
      $("html").addClass("dark-mode");
      break;
  };

};

// Shhh
const analytics = firebase.analytics();
