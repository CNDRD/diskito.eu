

Object.keys(operatorDict).forEach(key => {
  let opName = key;
  let opData = operatorDict[key];

  $('#op-div').append(getCard(opName, opData));
});



function getCard(opName, opData) {
  let yearCode = getOperatorData(opName,"year");
  let opHealth = getOperatorData(opName,"health");
  let operationName = getSeasonNameFromCode(yearCode);

  let a = `
    <div>
      <div class="uk-card uk-card-secondary uk-card-hover uk-light">
        <div class="uk-card-body uk-padding-remove">

          <div class="uk-flex uk-flex-row uk-flex-bottom">
            <img class="uk-preserve-width" data-src="${getOperatorIconUrl(opName)}" style="height: 6rem" uk-img />
            <div class="uk-flex uk-flex-column uk-flex-left uk-margin-small-bottom">
              <div class="uk-text-emphasis uk-text-large cndrd-font-medium uk-text-italic">${getFunnyNames(opName)}</div>

              <div class="uk-child-width-1-2" uk-grid>
                <div>
                  <div class="uk-flex uk-flex-column uk-flex-middle">
                    <span>Health</span>
                    <ul class="uk-dotnav">
                      <li class="${opHealth >= 1 ? 'uk-active' : ''}"><a href="#">Item 1</a></li>
                      <li class="${opHealth >= 2 ? 'uk-active' : ''}"><a href="#">Item 2</a></li>
                      <li class="${opHealth == 3 ? 'uk-active' : ''}"><a href="#">Item 3</a></li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div class="uk-flex uk-flex-column uk-flex-middle">
                    <span>Speed</span>
                    <ul class="uk-dotnav">
                      <li class="${opHealth <= 3 ? 'uk-active' : ''}"><a href="#">Item 3</a></li>
                      <li class="${opHealth <= 2 ? 'uk-active' : ''}"><a href="#">Item 2</a></li>
                      <li class="${opHealth == 1 ? 'uk-active' : ''}"><a href="#">Item 1</a></li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-small-bottom">
            <img class="uk-preserve-width uk-margin-small-left" src="${countryCodeToFlag(getOperatorData(opName,"countryCode"))}" />
            <div class="uk-text-emphasis uk-text-center cndrd-font-normal uk-margin-small-left" uk-tooltip="${yearCode}">
              <span style="color:${getSeasonColorRGB(getSeasonNumberFromCode(yearCode))}">${operationName}</span>
            </div>
            <div class="uk-text-emphasis uk-text-center cndrd-font-normal uk-margin-small-left">
              ${getOperatorData(opName,"unit")}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
  return a;
};
function getFunnyNames(op) {
  let x = {
    kapkan: "Trapkan",
    tachanka: "Chanka",
    glaz: "Glacek",
    fuze: "Fuze",
    iq: "IQ",
    blitz: "Blitz",
    bandit: "Bandit",
    jager: "Jäger",
    rook: "Rook",
    doc: "Doc",
    twitch: "Twitch",
    montagne: "Montagne",
    thermite: "Thermite",
    pulse: "Pulse",
    castle: "Castle",
    ash: "Ash",
    thatcher: "Thotcher",
    smoke: "Smonk",
    sledge: "Sledge",
    mute: "Mute",
    frost: "Fwost",
    buck: "Buwuck",
    valkyrie: "Vaklýra",
    blackbeard: "Šmeckbeard",
    capitao: "Capitão",
    caveira: "Coomveira",
    echo: "Echo",
    hibana: "Hibibana",
    jackal: "Trackal",
    mira: "Mirka",
    lesion: "Leštión",
    ying: "Čingiling",
    ela: "Ela",
    zofia: "Zofia",
    dokkaebi: "Dokkebabi",
    vigil: "Virgin",
    finka: "Fifinka",
    lion: "Lion",
    alibi: "Alibabi",
    maestro: "Maestro",
    maverick: "Maverick",
    clash: "Trash",
    kaid: "Kaid",
    nomad: "Twomad",
    gridlock: "Thicclock",
    mozzie: "Buzzie",
    warden: "Warden",
    nokk: "Nøkk",
    goyo: "Geyo",
    amaru: "Amaru",
    kali: "Kali",
    wamai: "Wahmai",
    iana: "Iana",
    oryx: "Oryx",
    melusi: "Mewusi",
    ace: "Ace",
    zero: "Zero",
    aruni: "Awuni",
    flores: "Bouchal",
    thunderbird: "Thunderfuck",
    osa: "Osa",
    thorn: "Thorn"
  };
  return x[op] || "Wrong operator!";
};
