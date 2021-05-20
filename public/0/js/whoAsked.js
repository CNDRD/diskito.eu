
doTheThingy();

async function doTheThingy(){
  let speedMs = 0;
  let start = 0;
  let end = 100;
  let bigN = start;

  while (bigN <= end){

    if (bigN >= end){

      await sleep(150);

      $('#huh').replaceWith(`<h1 class="content-title font-size-50 mt-25 text-center" id='huh'>${getRandomMessage()}</h1>`);
      $('#title').replaceWith('');
      $('#thing').replaceWith('');
    };

    let smolN = 0;

    while (smolN < 10){
      await sleep(speedMs);
      $('#title').text(`${bigN}.${smolN}%`);
      $('#thing').replaceWith(getBar(bigN, smolN));

      if (bigN != 100){ smolN++ };
    }; /* while(smolN) */
    bigN++;
  }; /* while(bigN) */

}; /* doTheThingy() */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

function getRandomMessage() {
  let list = ["By my calculations nobody asked chief..",
              "I have maxed out the render distance, and I still can't see who asked",
              "I've searched far and wide but the only thing I found is noone.",
              "Yup. That's it. It's nobody a clock!",
              "I did not, and you're adopted."]
  return list[Math.floor(Math.random() * list.length)];
};

function getBar(bigN, smolN){
  let bar = `
  <div id='thing' class="progress w-450">
    <div class="progress-bar bg-success" role="progressbar" style="width: ${bigN}.${smolN}%"></div>
  </div>`
  return bar
};
