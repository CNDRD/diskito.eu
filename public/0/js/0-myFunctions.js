// https://stackoverflow.com/a/16637170
function addSpaces(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");}

function roundTwo(x){return Math.round(x*100)/100}

// Get Times Function
function getTime(s){
  var t = [];
  s.forEach(u => { t.push(Math.round((u/60/60)*100)/100) });
  return t;
};

// Get One Time Function
function getOneTime(s){
  return Math.round((s/60/60)*100)/100;
};
