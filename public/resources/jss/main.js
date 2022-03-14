let theme = localStorage.getItem('theme');
if (theme) { changeTheme(theme); }


$(document).ready(function(){

  $("#menu").click(function(){
    $("#hidden").slideToggle(150);
  });

  $(".theme-switch").click(function(){
    changeTheme(this.innerHTML);
  });

});

function changeTheme(toWhat) {
  console.log(toWhat);

  switch ( toWhat ) {
    case "☀️":
    case "Light Mode":
      $("#theme-switch").text("🌑");
      $("#mobile-theme-switch").text("Dark Mode");
      localStorage.setItem("theme", "☀️");
      document.documentElement.style.setProperty("--background-color", "hsl(46, 100%, 97%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(212, 33%, 23%)");
      break;
    case "🌑":
    case "Dark Mode":
      $("#theme-switch").text("☀️");
      $("#mobile-theme-switch").text("Light Mode");
      localStorage.setItem("theme", "🌑");
      document.documentElement.style.setProperty("--background-color", "hsl(212, 33%, 23%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(46, 100%, 97%)");
      break;
  };

};
