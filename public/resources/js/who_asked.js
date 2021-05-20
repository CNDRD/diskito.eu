doTheThingy();

async function doTheThingy() {
  let speedMs = 0;
  let start = 0;
  let end = 100;
  let bigN = start;

  while (bigN <= end) {

    if (bigN >= end) {
      await sleep(150);
      $('#progressDiv').replaceWith(`<h1 class="uk-text-primary">${getRandomMessage()}</h1>`);
    };

    let smolN = 0;
    while (smolN < 10){
      await sleep(speedMs);
      $('#progressDiv span').text(`${bigN}.${smolN}%`);
      $('#progressDiv progress').replaceWith(getBar(bigN, smolN));
      if (bigN != 100){ smolN++ };
    };
    bigN++;
  };
};

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); };

function getBar(bigN, smolN) {
  let bar = `<progress class="uk-progress" value="${bigN}.${smolN}" max="100">${bigN}.${smolN}%</progress>`
  return bar
};

function getRandomMessage() {
  let list = ["By my calculations nobody asked chief..",
              "I have maxed out the render distance, and I still can't see who asked",
              "I've searched far and wide but the only thing I found is noone.",
              "Yup. That's it. It's nobody a clock!",
              "I did not, and you're adopted."]
  return list[Math.floor(Math.random() * list.length)];
};
