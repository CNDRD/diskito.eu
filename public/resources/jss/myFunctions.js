// https://stackoverflow.com/a/16637170
function addSpaces(x, char=" ") {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, char);
};

function reduceStringLength(str, len) {
  return str.substr(0,len).length > (len-1) ? `${str.substr(0,len)}..` : str.substr(0,len)
};

// Get One Time Function
function getOneTime(s) {
  return Math.round((s / 60 / 60) * 100) / 100;
};

function nextLevelXP(level) {
  return parseInt(5 / 6 * level * (2 * level * level + 27 * level + 91));
};

function roundTwo(x) {
  return Math.round(x * 100) / 100;
};

// https://stackoverflow.com/a/44185289/13186339
function get(object, key, default_value) {
  var result = object[key];
  return (typeof result !== "undefined") ? result : default_value;
}
