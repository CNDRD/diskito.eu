doTheThingy();

async function doTheThingy() {
  let start = 0;
  let end = 100;
  let bigN = start;

  while (bigN <= end) {

    if (bigN >= end) {
      await sleep();
      $("#progress-div").replaceWith(`<div id="done">${getRandomMessage()}</div>`);
    };

    let smolN = 0;
    while (smolN < 10){
      await sleep();
      $("#progress-div span").text(`${bigN}.${smolN}%`);
      $("#progress-div progress").replaceWith(getBar(bigN, smolN));
      if (bigN != 100){ smolN++ };
    };
    bigN++;

  };
};

function sleep() { return new Promise(resolve => setTimeout(resolve, 0)); };

function getBar(bigN, smolN) {
  return `<progress value="${bigN}.${smolN}" max="100">${bigN}.${smolN}%</progress>`;
};

function getRandomMessage() {
  let list = [
    "By my calculations nobody asked chief..",
    "I have maxed out the render distance, and I still can't see who asked",
    "I've searched far and wide but the only thing I found is noone.",
    "Yup. That's it. It's nobody o'clock!",
    "I did not, and you're adopted.",
    "Maybe try again later, I wasn't able find anybody at this time",
    "Your parents didn't ask for you, yet here we are",
  ];
  return list[Math.floor(Math.random() * list.length)];
};
