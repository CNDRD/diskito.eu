let theme = localStorage.getItem('theme');
if (theme) {
  changeTheme(theme);
}


$(document).ready(function(){

  $("#menu").click(function(){
    $("#hidden").slideToggle(150);
  });

  $("#theme-switch").click(function(){
    changeTheme( $("#theme-switch").text() );
  });

});

function changeTheme(toWhat) {
  
  switch (toWhat) {
    case "☀️":
      $("#theme-switch").text("🌑");
      localStorage.setItem("theme", toWhat);
      document.documentElement.style.setProperty("--background-color", "hsl(46, 100%, 97%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(212, 33%, 23%)");
      break;
    case "🌑":
      $("#theme-switch").text("☀️");
      localStorage.setItem("theme", toWhat);
      document.documentElement.style.setProperty("--background-color", "hsl(212, 33%, 23%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(46, 100%, 97%)");
      break;
  };

};
