// https://stackoverflow.com/a/16637170
function addSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
