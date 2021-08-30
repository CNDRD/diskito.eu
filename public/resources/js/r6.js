$("table").stickyTableHeaders();
let id = new URLSearchParams(window.location.search).get('id');
let VERSION = 9;

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once('value').then(snapshot => {
  $("#lastUpdatedText").text( diff_minutes(new Date(snapshot.val()*1000), new Date()) );
  $("#lastUpdated").attr("uk-tooltip", `title: ${getTimeAndDateFromTimestamp(snapshot.val())}`);
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/all_data/${id}`).once('value').then(snapshot => {
  let d = snapshot.val();
  overallPage(d);
  operatorsPage(d);
});

function overallPage(d) {
  updateHeader(d);
  updateSeasonalCard(d);
  updateQueueCard(d);
  updateGeneralCard(d);
  updateOperatorCard(d);
  updateWeaponTypeCard(d);
};
function operatorsPage(d) {
  let atk = orderBySubKey(d.operators.atk, 'time_played');
  let def = orderBySubKey(d.operators.def, 'time_played');
  let OPS = atk.concat(def);

  OPS.sort(function(a,b){return b.time_played-a.time_played});
  OPS.forEach(op => {
    if (op.name == "osa") { return };
    $('#operator_table').append(getOperatorRow(op));
  });
};


function updateHeader(d) {
  $('#profile_picture').attr('src', `https://ubisoft-avatars.akamaized.net/${d.ubisoftID}/default_256_256.png`);
  $('#TGVjGjztIQ').removeClass("uk-placeholder");
  $('#profile_picture').removeAttr("hidden");

  $('#username').text(d.ubisoftUsername);
  $('#username').attr("uk-tooltip",d.ubisoftUsername);

  document.title = `${d.ubisoftUsername}'s Rainbow Six: Siege Stats'`;
  $('#level').text(d.level);
  $('#alpha_pack').text(`${roundTwo(d.alphapackProbability/100)}%`);
  $('#total_playtime').text(`${convertSecondsToHours(d.totalPlaytime)}h`)

  $('#r6stats').attr('href',`https://r6stats.com/stats/${d.ubisoftID}`);
  $('#tab').attr('href',`https://tabstats.com/siege/player/${d.ubisoftID}`);
  $('#trn').attr('href',`https://r6.tracker.network/profile/id/${d.ubisoftID}`);
};
function updateSeasonalCard(d) {
  $('#season').text(getSeasonNameFromNumber(d.season));
  $('#season').css('color', getSeasonColorRGB(d.season));
  $('#season_code').text(getSeasonCodeFromNumber(d.season));

  $('#next_rank_mmr').text(addSpaces(parseInt(d.nextRankMMR)));
  $('#prev_rank_mmr').text(addSpaces(parseInt(d.prevRankMMR)));

  $('#current_rank_mmr').text(addSpaces(parseInt(d.currentMMR)));
  $('#current_rank_name').text(d.currentRank);
  $('#current_rank_img').attr('data-src', d.currentRankImage);

  $('#last_mmr_change').text(d.lastMMRchange);
  $('#last_mmr_change').addClass(d.lastMMRchange >= 0 ? ( d.lastMMRchange == 0 ? 'uk-text-muted' : 'uk-text-success' ) : 'uk-text-danger');

  $('#seasonal_kd').text(d.sDeaths == 0 ? 0 : roundTwo(d.sKills / d.sDeaths));
  $('#seasonal_wl').text((d.sWins + d.sLosses) == 0 ? 0 : `${roundTwo(d.sWins / (d.sWins + d.sLosses) * 100)}%`);
  $('#seasonal_games').text((d.sWins + d.sLosses) == 0 ? 0 : addSpaces(d.sWins + d.sLosses));

  $('#max_mmr').text(`${addSpaces(parseInt(d.maxMMR))} MMR`);
  $('#max_mmr_name').text(d.maxRank);
  $('#max_rank_img').attr('data-src', d.maxRankImage);


  // _casual
  $('#next_rank_mmr_casual').text(addSpaces(parseInt(d.nextRankMMRcasual+1)));
  $('#prev_rank_mmr_casual').text(addSpaces(parseInt(d.prevRankMMRcasual)));

  $('#current_rank_mmr_casual').text(addSpaces(parseInt(d.currentMMRcasual)));
  $('#current_rank_name_casual').text(d.currentRankCasual);
  $('#current_rank_img_casual').attr('data-src', d.currentRankImageCasual);

  $('#last_mmr_change_casual').text(d.lastMMRchangeCasual);
  $('#last_mmr_change_casual').addClass(d.lastMMRchangeCasual >= 0 ? ( d.lastMMRchangeCasual == 0 ? 'uk-text-muted' : 'uk-text-success' ) : 'uk-text-danger');

  $('#seasonal_kd_casual').text(roundTwo(d.sKillsCasual / d.sDeathsCasual));
  $('#seasonal_wl_casual').text(`${roundTwo(d.sWinsCasual / (d.sWinsCasual + d.sLossesCasual) * 100)}%`);
  $('#seasonal_games_casual').text(addSpaces(d.sWinsCasual + d.sLossesCasual));
};
function updateQueueCard(d) {
  /* Ranked */
  $('#ranked_playtime').text(getPlaytime(d.rankedPlaytime));
  $('#ranked_kd').text(roundTwo(d.rankedKills / d.rankedDeaths));
  $('#ranked_kills').text(addSpaces(d.rankedKills));
  $('#ranked_deaths').text(addSpaces(d.rankedDeaths));
  $('#ranked_games').text(addSpaces(d.rankedGames));

  /* Unranked */
  $('#unranked_playtime').text(getPlaytime(d.casualPlaytime));
  $('#unranked_kd').text(roundTwo(d.casualKills / d.casualDeaths));
  $('#unranked_kills').text(addSpaces(d.casualKills));
  $('#unranked_deaths').text(addSpaces(d.casualDeaths));
  $('#unranked_games').text(addSpaces(d.casualGames));

  /* Discovery */
  $('#discovery_playtime').text(getPlaytime(d.totalPlaytime - (d.rankedPlaytime + d.casualPlaytime)));
  $('#discovery_kd').text(roundTwo( (d.totalKills - (d.rankedKills + d.casualKills)) / (d.totalDeaths - (d.rankedDeaths + d.casualDeaths)) ));
  $('#discovery_kills').text(addSpaces(d.totalKills - (d.rankedKills + d.casualKills)));
  $('#discovery_deaths').text(addSpaces(d.totalDeaths - (d.rankedDeaths + d.casualDeaths)));
  $('#discovery_games').text(addSpaces(d.totalMatches - (d.rankedGames + d.casualGames)));
};
function updateGeneralCard(d) {
  $('#general_kd').text(roundTwo(d.totalKills / d.totalDeaths));
  $('#general_kills').text(addSpaces(d.totalKills));
  $('#general_deaths').text(addSpaces(d.totalDeaths));
  $('#general_assists').text(addSpaces(d.totalAssists));

  $('#general_wl').text(`${roundTwo(d.totalWins / (d.totalWins + d.totalLosses) * 100)}%`);
  $('#general_wins').text(addSpaces(d.totalWins));
  $('#general_losses').text(addSpaces(d.totalLosses));
  $('#general_matches').text(addSpaces(d.totalMatches));

  $('#general_headshots').text(addSpaces(d.totalHeadshots));
  $('#general_hs').text(`${roundTwo(d.hs)}%`);
  $('#general_dbnos').text(addSpaces(d.totalDBNOs));
  $('#general_suicides').text(addSpaces(d.totalSuicides));

  $('#general_melees').text(addSpaces(d.totalMeleeKills));
  $('#general_penetrations').text(addSpaces(d.totalPenetrationKills));
  $('#general_barricades').text(addSpaces(d.totalBarricades));
  $('#general_reinforcements').text(addSpaces(d.totalReinforcements));
};
function updateOperatorCard(d) {
  let ops = getTopTwoOperatorsFromEach(d);
  ops.forEach((op, i) => {
    $(`#operator_img_${i+1}`).attr('uk-tooltip', op.readable);
    $(`#operator_img_${i+1}`).attr('data-src', op.icon);
    $(`#operator_kd_${i+1}`).text(roundTwo(op.kills / op.deaths));
    $(`#operator_wl_${i+1}`).text(`${roundTwo(op.wins / (op.wins + op.losses) * 100)}%`);
    $(`#operator_playtime_${i+1}`).text(getOpPlaytime(op.time_played))
  });
};
function updateWeaponTypeCard(d) {
  d.weapon_types.forEach((w, index) => {
    $(`#wt_name_${index}`).text(`${addSpaces(w.name)}s`);
    $(`#wt_kills_${index}`).text(addSpaces(w.kills));
    $(`#wt_hits_${index}`).text(addSpaces(w.hits));
    $(`#wt_hsp_${index}`).text(`${roundTwo((w.headshots/w.kills)*100)}%`);
    $(`#wt_hs_${index}`).text(addSpaces(w.headshots));
  });
};

function getOperatorRow(op) {
  let kd = op.deaths == 0 ? "0" : roundTwo(op.kills/op.deaths);
  let wl = (op.wins+op.losses) == 0 ? "0" : roundTwo(op.wins / (op.wins+op.losses) * 100);
  let hs = op.kills == 0 ? "0" : roundTwo((op.headshots / op.kills) * 100);

  let kdtd = `
    <div class="uk-flex uk-flex-row uk-flex-nowrap uk-flex-center uk-flex-middle">
      <div class="uk-text-large uk-margin-small-right uk-text-emphasis cndrd-font-normal">
        ${kd}
      </div>
      <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-middle">
        <span class="uk-text-nowrap">${addSpaces(op.kills)} K</span>
        <span class="uk-text-nowrap">${addSpaces(op.deaths)} D</span>
      </div>
    </div>`;
  let wltd = `
    <div class="uk-flex uk-flex-row uk-flex-nowrap uk-flex-center uk-flex-middle">
      <div class="uk-text-large uk-margin-small-right uk-text-emphasis cndrd-font-normal">
        ${wl}
      </div>
      <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-middle">
        <span class="uk-text-nowrap">${addSpaces(op.wins)} W</span>
        <span class="uk-text-nowrap">${addSpaces(op.losses)} L</span>
      </div>
    </div>`;
  let hstd = `
    <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-middle">
      <div class="uk-text-large uk-text-emphasis cndrd-font-normal">${hs}%</div>
      <div class="uk-text-muted uk-text-nowrap">${addSpaces(op.headshots)}</div>
    </div>`;

  let name = `
    <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-left">
      <div class="uk-flex uk-flex-row uk-flex-middle">
        <div class="uk-text-emphasis cndrd-font-medium">${op.readable}</div>
        <img class="uk-preserve-width uk-margin-small-left" src="${countryCodeToFlag(getOperatorData(op.name,"countryCode"))}" />
      </div>
      <div class="uk-text-muted uk-text-small">${getSeasonNameFromCode(getOperatorData(op.name,"year"))} | ${getOperatorData(op.name,"unit")}</div>
    </div>
  `;

  let abilities = "";
  orderBySubKey(op.unique_stats, 'value').forEach(ua => {
    abilities += `<li>${ua.name} - ${addSpaces(ua.value)}</li>`;
  });

  let ability = `
    <div class="uk-inline">
      <img class="uk-preserve-width" data-src="${getUniqueAbilityImage(op.name)}" style="height: 4rem" uk-img />
      <div uk-drop="mode: click; pos:left-center">
        <div class="uk-card uk-card-body uk-card-secondary">
          <ul class="uk-list uk-list-divider">
            ${abilities}
          </ul>
        </div>
      </div>
    </div>
  `;

  return `
    <tr ${getDATA(op)}>
      <td class="uk-text-center"> <img class="uk-preserve-width" data-src="${op.icon}" style="height: 6rem" uk-img /> </td>
      <td class="uk-text-middle uk-text-large uk-visible@m">${name}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${kd*100}">${kdtd}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${wl*100}">${wltd}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${hs*100}">${hstd}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@l cndrd-font-normal">${addSpaces(op.dbnos)}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@l cndrd-font-normal">${addSpaces(op.melees)}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@m cndrd-font-normal uk-text-nowrap" sorttable_customkey="${op.time_played}">${getOperatorPlaytime(op.time_played)}</td>
      <td class="uk-text-center uk-text-middle uk-visible@l"> ${ability} </td>
    </tr>`
};

function getDATA(op) {
  let kd = (op.deaths == 0 ? 0 : roundTwo(op.kills/op.deaths)) >= 1 ? "more" : "less";
  let wl = ((op.wins+op.losses) == 0 ? 0 : roundTwo(op.wins / (op.wins+op.losses) * 100)) >= 50 ? "more" : "less";
  let hs = (op.kills == 0 ? 0 : roundTwo((op.headshots / op.kills) * 100)) >= 50 ? "more" : "less";
  return `
    data-atkdef="${op.atkdef}"
    data-kd="${kd}"
    data-wl="${wl}"
    data-hs="${hs}"
    data-year="${getOperatorData(op.name, "year").charAt(1)}"
  `;
};
function countryCodeToFlag(cc) {
  let x = {
    RU: "4M9mCyD5uX0Ac08Bx7tZOj/cafe77b81327236006f52f231b333687/RU.png",
    DE: "5pEMIH1bVPSdUFnH3oppZM/6e84ff5b9c6d2a1948c89faca8746831/DE.png",
    FR: "3ALaNLw8pLQMC82Vp2TfQb/beac65434e9d2f5373b68a1ae1907652/FR.png",
    US: "4RRfp83SQQ3oHmiAsTi6Ny/c9b7ddd0c92bb3a7a4b088882fde80f4/flag-usa.png",
    GB: "13v7HZhhzqVosJH85uGu8X/ecf84c70d8712ed67384ce4ca24bd878/GB.png",
    CA: "5glq4YrvvPlKug56451Rbu/4b488144ab79972f8756851a98156ad2/CA.png",
    BR: "HeAGBBrHG585Dm1XqAPbR/c0f72a3e9a39fc60ab3fc0409295a129/BR.png",
    JP: "62dPlsstE3WKmnHLhbNOG4/f531c2faf8d5ec267efab380cb83da3c/JP.png",
    ES: "7p1GaoyUan72tNiBo0PhWz/c02804e405c9bfd2120e2ac821c4573e/ES.png",
    HK: "1l3F6UCuMc0VDpdcSchMNC/7d7be6e468f01f960ce9e205dddc24d0/HK.png",
    SK: "MINKSYtWw0fzwOluwS5HK/8875922c90e9d5a99daa5c8ec97f4682/SK.png",
    PL: "6VS4FvfT2cmjh9p1LpyINS/f910b13e077263b7ba2188e60d324e39/PL.png",
    IT: "2LLOPAbANxdBbTqT490GcW/eea2a3642c4f2a6908165f1806911d64/IT.png",
    MA: "1jGQpX1nDj1pvL5NZK5oZ7/0e569c1f6e9b10bf98b7eb8c26b67649/MA.png",
    AN: "mYjUqmrkqc5ZIzXeCO71v/84895ced4eeef93eab7734959e4f6ae2/flag-anz.png",
    DK: "2yPUr11p8hv9OLYwq69LdI/5cf2de76eb37b83ef3f7f5a5976a4b19/DK.png",
    PE: "1uvmZViUtI6PvnlESMz7Jt/772067de4226f4ea0c0226d44edf6df5/PE.png",
    MX: "3bHBhNtHWiHfMpRs20oFUW/f309bdcef9ec57972bdf2233f933de30/MX.png",
    IN: "VCUqpG0CdXCJsbRJbttJP/b59204dc28afb0ac1fbb8e56c7bd9418/INDIA.jpg",
    KE: "0OxhMNvy1EqyPJiEcEF4h/405e44a06b3a6b17e46d148db23f8c86/KENYA.jpg",
    NL: "1Gxn0nq1pzhxds4FSfZd1U/126698570cb5ae6f54dcb67e0bd65903/flag-nl.png",
    JO: "3asKYUZZduFgo37Hs7V1wz/d63bb88e4ac19f7b2a7822af1402a037/flag-jo.png",
    NO: "6TmfybfDUkmTqefkRApobQ/22adb72762b45aec088d5ad665332d28/flag-no.png",
    SA: "a99qbsVWb6Lc7T4v50N6O/9ec18f236f283d9ac0aaac28c6762d09/flag-sa.png",
    TH: "4JOrWXjjryauDVMa4JBcQq/9c7e2999def5e579d969607553395f86/flag-thailand.png",
    AR: "7q1b76Cha9Gp62F506Gi0C/82abe986bbc6b2768f693c08f9ce1a17/flag-argentina.png",
    HR: "5rYMZfhKKItdtUVRBLxZqm/79d895f738c7db6b742afcf041ddd612/flag-croatia.png",
  };
  return `https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/${x[cc]}` || "Wrong code";
};
function getUniqueAbilityImage(op) {
  let x = {
    kapkan: "FLgwGbMiZTrWcK62KxPq8/d4e584420f85fa61c09e5e57e12d9dd9/Entry-Denial-Device.png",
    tachanka: "37wX75QnY7XA6KbjM4aF5n/0ab116d398cf71463e11d43913818ec1/Shumikha-Launcher.png",
    glaz: "73bNPGhlIuhlWvi497sYqE/b68414436088f62f9da44cd42f702df7/Flip-Sight.png",
    fuze: "3YaoPPUbFYeVSCemdj57EL/a4a4a8c0a935640f7d9a1d1ea82bc48c/Cluster-Charge.png",
    iq: "23Nk2ie06rb3DcZnStryIY/e06226196dd582c905c33fad87dfdd63/Electronics-Detector.png",
    blitz: "7EXDIOjPFMhPKZWY5OcEQC/f2df48ebe5673dca7773d81efd940b66/Flash-Shield.png",
    bandit: "129HTNU2A5kIcMj0KZ5UjU/858b60dd0e9b8692e2dc693eded50e14/Shock-Wire.png",
    jager: "1YCujceutAcJ7F10yhHC41/c5f870e7789b6396c9997ed45ccd3beb/Active-Defense-System.png",
    rook: "MeoKw7iPY6EFYvjS07CRg/b2d7eba623f3c63d6b7097a8f2253954/Armor-Pack.png",
    doc: "7njaeUjJj27iYH27HnH6jn/c5533d2d7191b879c313013f278f5f59/Stim-Pistol.png",
    twitch: "5dZ9kaUfUSF3piuFIUKf2t/7ebfc51caee42a776492b56251d45d92/Shock-Drones.png",
    montagne: "1bmXJOakdA6SOrGxBKA70T/1e489e366d6db287f475963df2040d3d/Extendable-Shield.png",
    thermite: "R5giHT90R2XOMMuUENZeK/840a5a391ed57a0c62208e72258407a7/Exothermic-Charge.png",
    pulse: "7dPXIadD3D2a3uEqrCPvj2/103ad9d0d3b71adee3b92a5db96fe24d/Heartbeat-Sensor.png",
    castle: "29N9nMqB8ZZxGCPz128ccD/439cb1fcb2f6d5385378cf073a5fbc30/Armor-Panel.png",
    ash: "0114WqhzsMsnvaKc4FypkN/5ebb9b86e216a2d9e6b2ea01eb3346e8/Breaching-Rounds.png",
    thatcher: "4p4srpOH4sq55OHryHhn5t/d31728d1432ed28c429ea566caf0e083/EMP-Grenade.png",
    smoke: "3ZbADU6FxBqdvcA8vCpYhn/6c69d61202364fa420e2a319d817c6f3/Remote-Gas-Grenade.png",
    sledge: "2Vyo9CrQ1J7IZe43XpT4pV/4bc02e829d1b1745b9a527ff34f8fafb/Tactical-Breaching-Hammer.png",
    mute: "1M5fsUELbaAzImzMte2ESa/9de588693ec317c87ef1a2021bd43b86/Signal-Disruptor.png",
    frost: "xsIzH7XCAqvn7F3tEfAPe/c41e59a9d7f2ed7ee38b16ed0a882351/Welcome-Mate.png",
    buck: "2w8EQtN4FFtEMa9lBYyWGg/36bbc6d819761c11418c868d2e483991/Skeleton-Key.png",
    valkyrie: "1EPfd4xeuMpt5nItOYm2Eb/b59223248a508d205264ece3c3553d36/Black-Eye.png",
    blackbeard: "2dZeBTlDDdFQKb4PYb8F5v/162d60178a75cde9f65be362eacc880a/Rifle-Shield.png",
    caveira: "6PTsBBBGTT5oixxzvYv1Y4/18e31c74ba1ca73ed2694134acd9c078/Silent-Step.png",
    capitao: "5ur3NZUGos3i2HR8f0HIzj/46cf23c97453ebfedeaa42a1088ff32f/Tactical-Crossbow.png",
    echo: "TdDZyrKpjt9EQo8tHpIJk/d987db4da22046a0663be8be82dcda88/Yokai.png",
    hibana: "1QSzVxpGhswXix3vn8XGKj/c4f64fa0895bdaf164448e3ae49950a0/X-Kairos.png",
    mira: "1a1w8epOhWE8VtzvvCJG9d/b20cbb221f7d45e5838f839ce042f409/Black-mirror.png",
    jackal: "2gexf5zLDsa74J7urCoDxk/50da09626395cbe1bf2a58e00a57a514/Eyenox-Model-III.png",
    lesion: "6PJv86R8CtQCWA7a24sJE2/24f3751b2ed941ce80a4c1ef394ab7d5/Gu-mines.png",
    ying: "4vpN9vu5wD9dyb2knMosTy/430796de3c0c2a5c2eb2ac6f4217eba0/Candela.png",
    dokkaebi: "5ej2g1iCMHdfjn8h8qgfmU/bf07fef4b063a46389ca650ed02b292a/Logic-Bomb.png",
    vigil: "6WbhiNk0evsKWChPneCES6/af08476e2f917878e0326727d2d5fb8a/ERC-7.png",
    zofia: "1elqIEWJ6XsXKAbMNd0Cai/0b4c0591bad284d957e652cdae0b706b/KS79-Lifeline.png",
    ela: "10Md7ccaUO0pE0nCWimeoZ/35dddc67a4141e844d7904051a0314dc/Grzmot-Mine.png",
    lion: "7fRknnWl2K2qjKle1t79j/0506d25798aeb0691c8a576665050f7d/EE-ONE-D.png",
    finka: "9xGRNPNznBKssvgQAtQNQ/9352fc88f2911ab40789412856b3e20e/Adrenal-Surge.png",
    alibi: "7sJYir66zAPq2omSvYeT2u/8fbe3370d32fb5433fb6d3a86d46a1b9/Prisma.png",
    maestro: "n2rfPidCv630jQEfnEWwb/42d454d0771218eb8f27f6d17d8a073e/Evil-Eye.png",
    clash: "1jck6fnzAMbMQrUMVsnA0M/d04a60eab0132e6bcc202a4f99186cdd/CCE-Shield.png",
    maverick: "4rPBvxDKsKiQCMjt7GxJMw/09e45c68bbc41c1721acbbe0257e2465/Breaching-Torch.png",
    kaid: "7rUOk2LhYIUjvYLot7GT8Y/94b72bfbbfdf50c2c807cdbf9f5b276e/Rtila-Electroclaw.png",
    nomad: "6d0LN1QWzviEkcYu3mTn6v/e49511a479756f71224f14225ad9cbd8/Airjab-Launcher.png",
    gridlock: "QGVvmZeZ91FC2X4mvMzgn/601fa45e635872aea31f15ffebb9c366/Trax-Stingers.png",
    mozzie: "5L0fFKVOwozKMcmJoenfef/56e4efdf77363556b35a76fd4e0e60f6/Pest-Launcher.png",
    nokk: "57miqbOn8xWBh7ne7za3CV/35364108d49380a0ed33998f970e104f/HEL-Presence-Reduction.png",
    warden: "40RkJUEmmBCf7bmfTL8ao1/1d973adfe4d002c94655d9818776fb41/Glance-Smart-Glasses.png",
    amaru: "3WejtMAtiITfpjDMuq6j4t/b52e58da6b2625839aa23f940c8e6639/Garra-Hook.png",
    goyo: "1JqlRdbaVA73jDq8y46vX4/82e89f39c479526ace294ba246d0b085/Volcan-Shield.png",
    kali: "75eebt48ELO4eGGdIMVMpY/9533c7dc8f36651f5b5ad50c8ccb6c5a/LV_Explosive_Lance.png",
    wamai: "1IKNZzLv63AJd9vlbXj3Bo/883371432ffb22e5bf35bc82dd706384/Mag-net_System.png",
    iana: "K8E4EHWbD8wTjVqro6wVl/62339b2fbe1d3a2319dcd320f7a0b070/r6s-operator-ability-iana.png",
    oryx: "3dM2B3qCdU0woydIbiy2xn/55aa99443002ad794d3f78dada26d035/r6s-operator-ability-oryx.png",
    ace: "2sjKOnwHeOX2xn3iIpja2A/e265f675c905ac25c23ed11fc85589bb/r6s-operator-ability-ace.png",
    melusi: "49ixqWhGgjvHu0Ay8JzeSH/c6a3fe584847850186e15c7fb4244385/r6s-operator-ability-melusi.png",
    zero: "6h4hyVSzG8IwAmEl1Objrd/6e51e64eeffcc68746b8ff59445fb103/r6s-operator-ability-zero.png",
    aruni: "4hLJAAVKrf50wosG0471od/cde1867daf863c03754969f159ac00de/r6s-operator-ability-aruni.png",
    flores: "1z7eSI5D8IRIOHi0PJu4yq/3c4a273098a840957a248583f73fa8ff/r6s-operator-ability-flores.png",
    thunderbird: "67J9QnmuA4TMI3rBxoA3Jz/4ec42d8c1bb61dadc5f36893f93142e8/r6s-operator-ability-thunderbird.png",
    osa: "",
  };
  return `https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/${x[op]}` || "Wrong operator";
};
function getOperatorData(op, what) {
  let x = {
    kapkan:{
      year:"Y0S0",
      health:2,
      unit:"SPETSNAZ",
      countryCode:"RU",
      roles:["Trap"],
    },
    tachanka:{
      year:"Y0S0",
      health:3,
      unit:"SPETSNAZ",
      countryCode:"RU",
      roles:["Anchor","Covering Fire","Shield"],
    },
    glaz:{
      year:"Y0S0",
      health:2,
      unit:"SPETSNAZ",
      countryCode:"RU",
      roles:["Back Line","Covering Fire","Soft Breach"],
    },
    fuze:{
      year:"Y0S0",
      health:3,
      unit:"SPETSNAZ",
      countryCode:"RU",
      roles:["Area Denial","Disable","Flank"],
    },
    iq:{
      year:"Y0S0",
      health:1,
      unit:"GSG9",
      countryCode:"DE",
      roles:["Disable","Flank","Front Line","Intel Gatherer"],
    },
    blitz:{
      year:"Y0S0",
      health:2,
      unit:"GSG9",
      countryCode:"DE",
      roles:["Anti Roam","Crowd Control","Front Line","Shield"],
    },
    bandit:{
      year:"Y0S0",
      health:1,
      unit:"GSG9",
      countryCode:"DE",
      roles:["Anti Hard Breach","Roam","Secure"],
    },
    jager:{
      year:"Y0S0",
      health:2,
      unit:"GSG9",
      countryCode:"DE",
      roles:["Roam","Secure"],
    },
    rook:{
      year:"Y0S0",
      health:3,
      unit:"GIGN",
      countryCode:"FR",
      roles:["Anchor","Buff"],
    },
    doc:{
      year:"Y0S0",
      health:3,
      unit:"GIGN",
      countryCode:"FR",
      roles:["Anchor","Buff"],
    },
    twitch:{
      year:"Y0S0",
      health:2,
      unit:"GIGN",
      countryCode:"FR",
      roles:["Back Line","Disable","Front Line","Intel Gatherer"],
    },
    montagne:{
      year:"Y0S0",
      health:3,
      unit:"GIGN",
      countryCode:"FR",
      roles:["Shield"],
    },
    thermite:{
      year:"Y0S0",
      health:2,
      unit:"SWAT",
      countryCode:"US",
      roles:["Back Line","Hard Breach"],
    },
    pulse:{
      year:"Y0S0",
      health:1,
      unit:"SWAT",
      countryCode:"US",
      roles:["Intel Gatherer","Roam"],
    },
    castle:{
      year:"Y0S0",
      health:2,
      unit:"SWAT",
      countryCode:"US",
      roles:["Anchor","Secure"],
    },
    ash:{
      year:"Y0S0",
      health:1,
      unit:"SWAT",
      countryCode:"US",
      roles:["Disable","Flank","Front Line","Soft Breach"],
    },
    thatcher:{
      year:"Y0S0",
      health:2,
      unit:"SAS",
      countryCode:"GB",
      roles:["Back Line","Disable"],
    },
    smoke:{
      year:"Y0S0",
      health:2,
      unit:"SAS",
      countryCode:"GB",
      roles:["Anchor","Area Denial","Secure"],
    },
    sledge:{
      year:"Y0S0",
      health:2,
      unit:"SAS",
      countryCode:"GB",
      roles:["Flank","Soft Breach"],
    },
    mute:{
      year:"Y0S0",
      health:2,
      unit:"SAS",
      countryCode:"GB",
      roles:["Anti Hard Breach","Intel Denier","Secure"],
    },

    frost:{
      year:"Y1S1",
      health:2,
      unit:"JTF2",
      countryCode:"CA",
      roles:["Crowd Control","Trap"],
    },
    buck:{
      year:"Y1S1",
      health:2,
      unit:"JTF2",
      countryCode:"CA",
      roles:["Flank","Soft Breach"],
    },
    valkyrie:{
      year:"Y1S2",
      health:2,
      unit:"NAVY SEAL",
      countryCode:"US",
      roles:["Intel Gatherer","Roam"],
    },
    blackbeard:{
      year:"Y1S2",
      health:2,
      unit:"NAVY SEAL",
      countryCode:"US",
      roles:["Back Line","Covering Fire","Shield"],
    },
    caveira:{
      year:"Y1S3",
      health:1,
      unit:"BOPE",
      countryCode:"BR",
      roles:["Intel Denier","Intel Gatherer","Roam"],
    },
    capitao:{
      year:"Y1S3",
      health:1,
      unit:"BOPE",
      countryCode:"BR",
      roles:["Area Denial","Flank","Front Line"],
    },
    echo:{
      year:"Y1S4",
      health:3,
      unit:"S.A.T.",
      countryCode:"JP",
      roles:["Anchor","Crowd Control","Intel Gatherer","Secure"],
    },
    hibana:{
      year:"Y1S4",
      health:1,
      unit:"S.A.T.",
      countryCode:"JP",
      roles:["Back Line","Front Line","Hard Breach"],
    },

    mira:{
      year:"Y2S1",
      health:3,
      unit:"G.E.O.",
      countryCode:"ES",
      roles:["Anchor","Intel Gatherer","Secure"],
    },
    jackal:{
      year:"Y2S1",
      health:2,
      unit:"G.E.O.",
      countryCode:"ES",
      roles:["Anti Roam","Intel Gatherer"],
    },
    lesion:{
      year:"Y2S3",
      health:2,
      unit:"S.D.U",
      countryCode:"HK",
      roles:["Anchor","Crowd Control","Intel Gatherer","Roam","Trap"],
    },
    ying:{
      year:"Y2S3",
      health:2,
      unit:"S.D.U",
      countryCode:"HK",
      roles:["Crowd Control","Front Line"],
    },
    dokkaebi:{
      year:"Y2S4",
      health:2,
      unit:"707TH SMB",
      countryCode:"SK",
      roles:["Anti Roam","Flank","Intel Denier","Intel Gatherer"],
    },
    vigil:{
      year:"Y2S4",
      health:1,
      unit:"707TH SMB",
      countryCode:"SK",
      roles:["Intel Denier","Roam"],
    },
    zofia:{
      year:"Y2S4",
      health:2,
      unit:"G.R.O.",
      countryCode:"PL",
      roles:["Anti Roam","Crowd Control","Disable","Flank","Soft Breach"],
    },
    ela:{
      year:"Y2S4",
      health:1,
      unit:"G.R.O.",
      countryCode:"PL",
      roles:["Crowd Control","Roam","Trap"],
    },

    lion:{
      year:"Y3S1",
      health:2,
      unit:"GIGN",
      countryCode:"FR",
      roles:["Anti Roam","Back Line","Crowd Control","Intel Gatherer"],
    },
    finka:{
      year:"Y3S1",
      health:2,
      unit:"SPETSNAZ",
      countryCode:"RU",
      roles:["Back Line","Buff"],
    },
    alibi:{
      year:"Y3S2",
      health:1,
      unit:"G.I.S.",
      countryCode:"IT",
      roles:["Intel Denier","Intel Gatherer","Roam","Trap"],
    },
    maestro:{
      year:"Y3S2",
      health:3,
      unit:"G.I.S.",
      countryCode:"IT",
      roles:["Anchor","Area Denial","Intel Gatherer","Secure"],
    },
    clash:{
      year:"Y3S3",
      health:3,
      unit:"MPS",
      countryCode:"GB",
      roles:["Crowd Control","Intel Gatherer","Secure","Shield"],
    },
    maverick:{
      year:"Y3S3",
      health:1,
      unit:"THE UNIT",
      countryCode:"US",
      roles:["Back Line","Disable","Flank","Hard Breach"],
    },
    kaid:{
      year:"Y3S4",
      health:3,
      unit:"GIGR",
      countryCode:"MA",
      roles:["Anchor","Anti Hard Breach","Secure"],
    },
    nomad:{
      year:"Y3S4",
      health:2,
      unit:"GIGR",
      countryCode:"MA",
      roles:["Anti Roam","Crowd Control","Trap"],
    },

    gridlock:{
      year:"Y4S1",
      health:3,
      unit:"SASR",
      countryCode:"AN",
      roles:["Anti Roam","Area Denial","Crowd Control"],
    },
    mozzie:{
      year:"Y4S1",
      health:2,
      unit:"SASR",
      countryCode:"AN",
      roles:["Intel Denier","Intel Gatherer","Secure"],
    },
    nokk:{
      year:"Y4S2",
      health:2,
      unit:"JAEGER CORPS",
      countryCode:"DK",
      roles:["Flank","Intel Denier"],
    },
    warden:{
      year:"Y4S2",
      health:2,
      unit:"SECRET SERVICE",
      countryCode:"US",
      roles:["Anchor","Intel Denier"],
    },
    amaru:{
      year:"Y4S3",
      health:2,
      unit:"APCA",
      countryCode:"PE",
      roles:["Flank","Front Line"],
    },
    goyo:{
      year:"Y4S3",
      health:2,
      unit:"FES",
      countryCode:"MX",
      roles:["Area Denial","Secure"],
    },
    kali:{
      year:"Y4S4",
      health:2,
      unit:"NIGHTHAVEN",
      countryCode:"IN",
      roles:["Back Line","Covering Fire","Disable"],
    },
    wamai:{
      year:"Y4S4",
      health:2,
      unit:"NIGHTHAVEN",
      countryCode:"KE",
      roles:["Anchor","Secure"],
    },

    iana:{
      year:"Y5S1",
      health:2,
      unit:"REU",
      countryCode:"NL",
      roles:["Intel Denier","Intel Gatherer"],
    },
    oryx:{
      year:"Y5S1",
      health:2,
      unit:"UNAFFILIATED",
      countryCode:"JO",
      roles:["Roam","Soft Breach"],
    },
    ace:{
      year:"Y5S2",
      health:2,
      unit:"NIGHTHAVEN",
      countryCode:"NO",
      roles:["Front Line","Hard Breach"],
    },
    melusi:{
      year:"Y5S2",
      health:1,
      unit:"ITF",
      countryCode:"SA",
      roles:["Crowd Control","Intel Gatherer","Secure"],
    },
    zero:{
      year:"Y5S3",
      health:2,
      unit:"ROS",
      countryCode:"US",
      roles:["Intel Denier","Intel Gatherer"],
    },
    aruni:{
      year:"Y5S4",
      health:2,
      unit:"NIGHTHAVEN",
      countryCode:"TH",
      roles:["Secure","Intel Gatherer","Anchor"],
    },

    flores:{
      year:"Y6S1",
      health:2,
      unit:"UNAFFILIATED",
      countryCode:"AR",
      roles:["Soft Breach","Disable","Area Denial","Back Line"],
    },
    thunderbird:{
      year:"Y6S2",
      health:1,
      unit:"UNAFFILIATED",
      countryCode:"",
      roles:["Secure","Roam","Buff"],
    },
    osa:{
      year:"Y6S3",
      health:2,
      unit:"NIGHTHAVEN",
      countryCode:"HR",
      roles:["Intel Gatherer","Area Denial","Anti Roam"],
    },
  };
  return x[op][what] || `Something went wrong [op:'${op}'|what:'${what}']`;
};
function reduceNameLength(a, len=14){
  return a.length > (len) ? `${a.substr(0,len)}..` : a.substr(0,len)
};
function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getSeasonColorRGB(s) {
  let x = {
    1: "#2e93b3",
    2: "#d0a344",
    3: "#47893b",
    4: "#bd1E2c",
    5: "#723093",
    6: "#0050b3",
    7: "#ca361c",
    8: "#006543",
    9: "#ffc113",
    10: "#949f39",
    11: "#81a0c1",
    12: "#aa854f",
    13: "#d2005a",
    14: "#304395",
    15: "#156309",
    16: "#089eb3",
    17: "#946a97",
    18: "#2b7f9b",
    19: "#6ca511",
    20: "#d14007",
    21: "#ac0000",
    22: "#009cbe",
    23: "#ffa200",
  };
  return x[s] || "Wrong Code";
};
function getSeasonNameFromCode(s) {
  let x = {
    "Y0S0": "Default",
    "Y1S1": "Black Ice",
    "Y1S2": "Dust Line",
    "Y1S3": "Skull Rain",
    "Y1S4": "Red Crow",
    "Y2S1": "Velvet Shell",
    "Y2S2": "Operation Health",
    "Y2S3": "Blood Orchid",
    "Y2S4": "White Noise",
    "Y3S1": "Chimera",
    "Y3S2": "Para Bellum",
    "Y3S3": "Grim Sky",
    "Y3S4": "Wind Bastion",
    "Y4S1": "Burnt Horizon",
    "Y4S2": "Phantom Sight",
    "Y4S3": "Ember Rise",
    "Y4S4": "Shifting Tides",
    "Y5S1": "Void Edge",
    "Y5S2": "Steel Wave",
    "Y5S3": "Shadow Legacy",
    "Y5S4": "Neon Dawn",
    "Y6S1": "Crimson Heist",
    "Y6S2": "North Star",
    "Y6S3": "Crystal Guard",
    "Y6S4": "High Calibre",
  };
  return x[s] || "Wrong Code";
};
function getSeasonNameFromNumber(s) {
  let x = {
    0: "Default",
    1: "Black Ice",
    2: "Dust Line",
    3: "Skull Rain",
    4: "Red Crow",
    5: "Velvet Shell",
    6: "Operation Health",
    7: "Blood Orchid",
    8: "White Noise",
    9: "Chimera",
    10: "Para Bellum",
    11: "Grim Sky",
    12: "Wind Bastion",
    13: "Burnt Horizon",
    14: "Phantom Sight",
    15: "Ember Rise",
    16: "Shifting Tides",
    17: "Void Edge",
    18: "Steel Wave",
    19: "Shadow Legacy",
    20: "Neon Dawn",
    21: "Crimson Heist",
    22: "North Star",
    23: "Crystal Guard",
    24: "High Calibre"
  };
  return x[s] || "Wrong Code";
};
function getSeasonCodeFromNumber(s) {
  let x = {
    0: "Y0S0",
    1: "Y1S1",
    2: "Y1S2",
    3: "Y1S3",
    4: "Y1S4",
    5: "Y2S1",
    6: "Y2S2",
    7: "Y2S3",
    8: "Y2S4",
    9: "Y3S1",
    10: "Y3S2",
    11: "Y3S3",
    12: "Y3S4",
    13: "Y4S1",
    14: "Y4S2",
    15: "Y4S3",
    16: "Y4S4",
    17: "Y5S1",
    18: "Y5S2",
    19: "Y5S3",
    20: "Y5S4",
    21: "Y6S1",
    22: "Y6S2",
    23: "Y6S3",
    24: "Y6S4",
    25: "Y7S1",
    26: "Y7S2",
    27: "Y7S3",
    28: "Y7S4",
  };
  return x[s] || "Wrong Code";
};
function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return `${hours}h ${minutes}m ${seconds}s`
};
function getOpPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  return `${hours}h ${minutes}m`
};
function convertSecondsToHours(s) {
  return Math.floor(s / 3600);
};
function getOperatorPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  return `${hours}h <span class="uk-text-small uk-text-muted">${minutes}m</span>`
};
function getTopTwoOperatorsFromEach(d) {
  let o = d.operators;

  let atk = orderBySubKey(o.atk, 'time_played');
  let def = orderBySubKey(o.def, 'time_played');

  return [atk[0], atk[1], def[0], def[1]]
};
function diff_minutes(dt2, dt1) {
  // https://www.w3resource.com/javascript-exercises/javascript-date-exercise-44.php
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
function getTimeAndDateFromTimestamp(UNIX_timestamp){
  // https://stackoverflow.com/a/6078873/13186339
  let a = new Date(UNIX_timestamp * 1000);
  let months = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  let year = a.getFullYear();
  let month = a.getMonth() + 1;
  let date = a.getDate();
  let hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
  let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  let sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  return `${hour}:${min}:${sec} / ${date}.${month}. ${year}`;
};


// Update button
let lastUpdateRef = firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`);
lastUpdateRef.once('value').then(snapshot => {
  let last_update = snapshot.val();

  let lastUpdateInterval = setInterval(function() {
    let now = parseInt(Date.now()/1000);
    let diff = now - last_update;

    $("#lastUpdated").replaceWith(`<span id="lastUpdated">${getUpdateTimeString(diff)}</span>`);

    if (diff >= 180) { $("#siegeManualUpdateButton").removeAttr("hidden"); }
  }, 1000);

  firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).on('value', snapshot => {
    if (snapshot.val() != last_update) { location.reload(); }
  });

});
function getUpdateTimeString(s) {
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;

  let msg = `${seconds} second${seconds == 1 ? '' : 's'}`;

  if (parseInt(minutes) != 0) {
    msg = `${minutes} minute${minutes == 1 ? '' : 's'} ${msg}`
  }
  if (parseInt(hours) != 0) {
    msg = `${hours} hour${hours == 1 ? '' : 's'} ${msg}`
  }

  return msg
};
