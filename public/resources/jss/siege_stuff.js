
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
    IE: "4ZTCTE7yj5Yp1NEaLL40f1/5f61da3cf0eff0666b769585ec2a9df4/flag-ireland.png"
  };
  return `https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/${x[cc]}` || "Wrong country code";
};
function getUniqueAbilityImage(op) {
  return operatorDict[op].uniqueAbilityImageURL || "Wrong operator";
};
function getOperatorPoseUrl(op) {
  return operatorDict[op].poseImageURL || "Missing asset";
};
function getOperatorIconUrl(op) {
  return operatorDict[op].iconImageURL || "Missing asset";
};
function getOperatorData(op, what = undefined) {
  let x = operatorDict;

  /*
  // Shows all of the unique roles
  function onlyUnique(value, index, self) { return self.indexOf(value) === index; };

  let kokoti = []
  let lol = Object.values( x ).map( value => value ).sort( (a,b) => b['health'] - a['health'] );
  lol.forEach((o,i) => { kokoti = kokoti.concat(o.roles); });
  console.log(kokoti.filter(onlyUnique));
  */

  if (!what) { return x[op] || `Something went wrong [op:'${op}']` };
  return x[op][what] || `Something went wrong [op:'${op}'|what:'${what}']`;
};


let seasonsDict = {
  0:{ 
    name: "Default",
    hex: "#ffffff",
    code: "Y0S0",
    startDate: "2015-12-01"
  },
  1:{ 
    name: "Black Ice",
    hex: "#2e93b3",
    code: "Y1S1",
    startDate: "2016-02-02"
  },
  2:{ 
    name: "Dust Line",
    hex: "#d0a344",
    code: "Y1S2",
    startDate: "2016-05-10"
  },
  3:{ 
    name: "Skull Rain",
    hex: "#47893b",
    code: "Y1S3",
    startDate: "2016-08-02"
  },
  4:{ 
    name: "Red Crow",
    hex: "#bd1E2c",
    code: "Y1S4",
    startDate: "2016-11-17"
  },

  5:{ 
    name: "Velvet Shell",
    hex: "#723093",
    code: "Y2S1",
    startDate: "2017-02-07"
  },
  6:{ 
    name: "Health",
    hex: "#0050b3",
    code: "Y2S2",
    startDate: "2017-06-07"
  },
  7:{ 
    name: "Blood Orchid",
    hex: "#ca361c",
    code: "Y2S3",
    startDate: "2017-09-05"
  },
  8:{ 
    name: "White Noise",
    hex: "#006543",
    code: "Y2S4",
    startDate: "2017-12-05"
  },

  9:{ 
    name: "Chimera",
    hex: "#ffc113",
    code: "Y3S1",
    startDate: "2018-03-06"
  },
  10: {
    name: "Para Bellum",
    hex: "#949f39",
    code: "Y3S2",
    startDate: "2018-06-07"
  },
  11: {
    name: "Grim Sky",
    hex: "#81a0c1",
    code: "Y3S3",
    startDate: "2018-09-04"
  },
  12: {
    name: "Wind Bastion",
    hex: "#aa854f",
    code: "Y3S4",
    startDate: "2018-12-04"
  },

  13: {
    name: "Burnt Horizon",
    hex: "#d2005a",
    code: "Y4S1",
    startDate: "2019-03-06"
  },
  14: {
    name: "Phantom Sight",
    hex: "#304395",
    code: "Y4S2",
    startDate: "2019-06-11"
  },
  15: {
    name: "Ember Rise",
    hex: "#156309",
    code: "Y4S3",
    startDate: "2019-09-11"
  },
  16: {
    name: "Shifting Tides",
    hex: "#089eb3",
    code: "Y4S4",
    startDate: "2019-12-03"
  },

  17: {
    name: "Void Edge",
    hex: "#946a97",
    code: "Y5S1",
    startDate: "2020-03-10"
  },
  18: {
    name: "Steel Wave",
    hex: "#2b7f9b",
    code: "Y5S2",
    startDate: "2020-06-16"
  },
  19: {
    name: "Shadow Legacy",
    hex: "#6ca511",
    code: "Y5S3",
    startDate: "2020-09-10"
  },
  20: {
    name: "Neon Dawn",
    hex: "#d14007",
    code: "Y5S4",
    startDate: "2020-12-01"
  },

  21: {
    name: "Crimson Heist",
    hex: "#ac0000",
    code: "Y6S1",
    startDate: "2021-03-16"
  },
  22: {
    name: "North Star",
    hex: "#009cbe",
    code: "Y6S2",
    startDate: "2021-06-14"
  },
  23: {
    name: "Crystal Guard",
    hex: "#ffa200",
    code: "Y6S3",
    startDate: "2021-09-07"
  },
  24: {
    name: "High Calibre",
    hex: "#587624",
    code: "Y6S4",
    startDate: "2021-11-30"
  },

  25: {
    name: "Demon Veil",
    hex: "#ffb52c",
    code: "Y7S1",
    startDate: "2022-03-15"
  },
  26: {
    name: "Vector Glare",
    hex: "#60cdb0",
    code: "Y7S2",
    startDate: "2022-06-14"
  },
  27: {
    name: "Brutal Swarm",
    hex: "#dac924",
    code: "Y7S3",
    startDate: "2022-09-14"
  },
  28: {
    name: "Solar Raid",
    hex: "#d03315",
    code: "Y7S4",
    startDate: "2022-12-07"
  },
  
  29: {
    name: "Commanding Force",
    hex: "#45abf3",
    code: "Y8S1",
    start_date: "2023-03-07"
  },
};

function getSeasonColorRGB(s) {
  return seasonsDict[s].hex || "#ffffff";
};
function getSeasonNameFromCode(s) {
  for (season in seasonsDict) {
    if (seasonsDict[season].code === s) {
      return seasonsDict[season].name;
    }
  };
  return "Wrong Code";
};
function getSeasonNameFromNumber(s) {
  return seasonsDict[s].name || "Wrong Code";
};
function getSeasonNumberFromCode(s) {
  for (season in seasonsDict) {
    if (seasonsDict[season].code === s) {
      return season;
    }
  };
  return "Wrong Code";
};
function getSeasonCodeFromNumber(s) {
  return seasonsDict[s].code || "Wrong Code";
};

function getRankImageFromRankName(name) {
  rank_dict = {
    "unranked": "0OFVqkI",
    "undefined": "0OFVqkI",

    "copper 5": "Ux1rDjw",
    "copper 4": "7YWtMtV",
    "copper 3": "LrHvwNs",
    "copper 2": "IIBimaN",
    "copper 1": "oLZwkBa",

    "bronze 5": "aQNXHQR",
    "bronze 4": "UgKcPME",
    "bronze 3": "DgVk34E",
    "bronze 2": "xsJGsmE",
    "bronze 1": "ktm9OM0",

    "silver 5": "tinDJ0V",
    "silver 4": "DTfqnBz",
    "silver 3": "V6V5iyx",
    "silver 2": "Xfrp58b",
    "silver 1": "6HpERmx",

    "gold 5": "GtTe4bu",
    "gold 4": "4kpPsMS",
    "gold 3": "tnX9jpW",
    "gold 2": "uVjR5kD",
    "gold 1": "tJ3tVr2",

    "platinum 5": "WO3pfUp",
    "platinum 4": "6Mev2HS",
    "platinum 3": "wV52ySL",
    "platinum 2": "qd71ZiS",
    "platinum 1": "WU6vjNa",

    "emerald 5": "KXtH98u",
    "emerald 4": "YSaeYN6",
    "emerald 3": "itcnov9",
    "emerald 2": "eEYH4bl",
    "emerald 1": "8FQRvNX",

    "diamond 5": "ioGplDE",
    "diamond 4": "arhoFpA",
    "diamond 3": "RXAvoqX",
    "diamond 2": "3BuBrb1",
    "diamond 1": "miyZ9Yr",

    "champion": "fTA4VtR",
    "champions": "fTA4VtR",
  }
  return `https://i.imgur.com/${rank_dict[name.toLowerCase()]}.png`
};
function getSeasonStartDate(seasonId) {
  let d = new Date(seasonsDict[seasonId].startDate);
  let months = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};


function getRankImageFromMMR(mmr, seasonID) {
  let x = "https://i.imgur.com/RpPdtbU.png";

  getSeasonalRankBracket(seasonID).forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) {
      x = getRankImageFromRankName(r.name);
    }
  });

  return x;
};
function getPrevRankMMR(mmr, seasonID) {
  let x = 0;
  getSeasonalRankBracket(seasonID).forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) {
      x = r.min_mmr;
    }
  });
  return x
};
function getNextRankMMR(mmr, seasonID) {
  let x = 0;
  getSeasonalRankBracket(seasonID).forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) {
      x = r.max_mmr + 1;
    }
  });
  return x
};

function getSeasonalRankBracket(season) {
  if (season <= 3) return seasonalRankMMRs.v1;
  if (season === 4) return seasonalRankMMRs.v2;
  if (season >= 5 && season <= 14) return seasonalRankMMRs.v3;
  if (season >= 15 && season <= 22) return seasonalRankMMRs.v4;
  if (season >= 23 && season <= 27) return seasonalRankMMRs.v5;
  if (season >= 28) return seasonalRankMMRs.v6;
}

const seasonalRankMMRs = {
  // Until Y1S3 | #3 | Skull Rain
  v1: [
    {name: "Unranked", min_mmr: 0, max_mmr: 0},
    {name: "Copper 1", min_mmr: 1, max_mmr: 2199},
    {name: "Copper 2", min_mmr: 2200, max_mmr: 2399},
    {name: "Copper 3", min_mmr: 2400, max_mmr: 2549},
    {name: "Copper 4", min_mmr: 2550, max_mmr: 2699},
    {name: "Bronze 1", min_mmr: 2700, max_mmr: 2799},
    {name: "Bronze 2", min_mmr: 2800, max_mmr: 2899},
    {name: "Bronze 3", min_mmr: 2900, max_mmr: 3049},
    {name: "Bronze 4", min_mmr: 3050, max_mmr: 3199},
    {name: "Silver 1", min_mmr: 3200, max_mmr: 3349},
    {name: "Silver 2", min_mmr: 3350, max_mmr: 3519},
    {name: "Silver 3", min_mmr: 3520, max_mmr: 3699},
    {name: "Silver 4", min_mmr: 3700, max_mmr: 3929},
    {name: "Gold 1", min_mmr: 3930, max_mmr: 4159},
    {name: "Gold 2", min_mmr: 4160, max_mmr: 4399},
    {name: "Gold 3", min_mmr: 4400, max_mmr: 4639},
    {name: "Gold 4", min_mmr: 4640, max_mmr: 4899},
    {name: "Platinum 1", min_mmr: 4900, max_mmr: 5159},
    {name: "Platinum 2", min_mmr: 5160, max_mmr: 5449},
    {name: "Platinum 3", min_mmr: 5450, max_mmr: 5999},
    {name: "Diamond", min_mmr: 6000, max_mmr: 999999}
  ],
  // Y1S4 | #4 | Red Crow
  v2: [
    {name: "Unranked", min_mmr: 0, max_mmr: 0},
    {name: "Copper 1", min_mmr: 1, max_mmr: 1399},
    {name: "Copper 2", min_mmr: 1400, max_mmr: 1499},
    {name: "Copper 3", min_mmr: 1500, max_mmr: 1599},
    {name: "Copper 4", min_mmr: 1600, max_mmr: 1699},
    {name: "Bronze 1", min_mmr: 1700, max_mmr: 1799},
    {name: "Bronze 2", min_mmr: 1800, max_mmr: 1899},
    {name: "Bronze 3", min_mmr: 1900, max_mmr: 1999},
    {name: "Bronze 4", min_mmr: 2000, max_mmr: 2099},
    {name: "Silver 1", min_mmr: 2100, max_mmr: 2199},
    {name: "Silver 2", min_mmr: 2200, max_mmr: 2299},
    {name: "Silver 3", min_mmr: 2300, max_mmr: 2399},
    {name: "Silver 4", min_mmr: 2400, max_mmr: 2499},
    {name: "Gold 1", min_mmr: 2500, max_mmr: 2599},
    {name: "Gold 2", min_mmr: 2600, max_mmr: 2699},
    {name: "Gold 3", min_mmr: 2700, max_mmr: 2700},
    {name: "Gold 4", min_mmr: 2800, max_mmr: 2999},
    {name: "Platinum 1", min_mmr: 3000, max_mmr: 3199},
    {name: "Platinum 2", min_mmr: 3200, max_mmr: 3399},
    {name: "Platinum 3", min_mmr: 3400, max_mmr: 3699},
    {name: "Diamond", min_mmr: 3700, max_mmr: 999999}
  ],
  // Y2S1 - Y4S2 | #5 - #14 | Velvet Shell - Phantom Sight
  v3: [
    {name: "Unranked", min_mmr: 0, max_mmr: 0},
    {name: "Copper 4", min_mmr: 1, max_mmr: 1399},
    {name: "Copper 3", min_mmr: 1400, max_mmr: 1499},
    {name: "Copper 2", min_mmr: 1500, max_mmr: 1599},
    {name: "Copper 1", min_mmr: 1600, max_mmr: 1699},
    {name: "Bronze 4", min_mmr: 1700, max_mmr: 1799},
    {name: "Bronze 3", min_mmr: 1800, max_mmr: 1899},
    {name: "Bronze 2", min_mmr: 1900, max_mmr: 1999},
    {name: "Bronze 1", min_mmr: 2000, max_mmr: 2099},
    {name: "Silver 4", min_mmr: 2100, max_mmr: 2199},
    {name: "Silver 3", min_mmr: 2200, max_mmr: 2299},
    {name: "Silver 2", min_mmr: 2300, max_mmr: 2399},
    {name: "Silver 1", min_mmr: 2400, max_mmr: 2499},
    {name: "Gold 4", min_mmr: 2500, max_mmr: 2699},
    {name: "Gold 3", min_mmr: 2700, max_mmr: 2899},
    {name: "Gold 2", min_mmr: 2900, max_mmr: 3099},
    {name: "Gold 1", min_mmr: 3100, max_mmr: 3299},
    {name: "Platinum 3", min_mmr: 3300, max_mmr: 3699},
    {name: "Platinum 2", min_mmr: 3700, max_mmr: 4099},
    {name: "Platinum 1", min_mmr: 4100, max_mmr: 4499},
    {name: "Diamond", min_mmr: 4500, max_mmr: 999999}
  ],
  // Y4S3 - Y6S2 | #15 - #22 | Ember Rise - North Star
  v4: [
    {name: "Unranked", min_mmr: 0, max_mmr: 0},
    {name: "Copper 5", min_mmr: 1, max_mmr: 1199},
    {name: "Copper 4", min_mmr: 1200, max_mmr: 1299},
    {name: "Copper 3", min_mmr: 1300, max_mmr: 1399},
    {name: "Copper 2", min_mmr: 1400, max_mmr: 1499},
    {name: "Copper 1", min_mmr: 1500, max_mmr: 1599},
    {name: "Bronze 5", min_mmr: 1600, max_mmr: 1699},
    {name: "Bronze 4", min_mmr: 1700, max_mmr: 1799},
    {name: "Bronze 3", min_mmr: 1800, max_mmr: 1899},
    {name: "Bronze 2", min_mmr: 1900, max_mmr: 1999},
    {name: "Bronze 1", min_mmr: 2000, max_mmr: 2099},
    {name: "Silver 5", min_mmr: 2100, max_mmr: 2199},
    {name: "Silver 4", min_mmr: 2200, max_mmr: 2299},
    {name: "Silver 3", min_mmr: 2300, max_mmr: 2399},
    {name: "Silver 2", min_mmr: 2400, max_mmr: 2499},
    {name: "Silver 1", min_mmr: 2500, max_mmr: 2599},
    {name: "Gold 3", min_mmr: 2600, max_mmr: 2799},
    {name: "Gold 2", min_mmr: 2800, max_mmr: 2999},
    {name: "Gold 1", min_mmr: 3000, max_mmr: 3199},
    {name: "Platinum 3", min_mmr: 3200, max_mmr: 3599},
    {name: "Platinum 2", min_mmr: 3600, max_mmr: 3999},
    {name: "Platinum 1", min_mmr: 4000, max_mmr: 4399},
    {name: "Diamond", min_mmr: 4400, max_mmr: 4999},
    {name: "Champion", min_mmr: 5000, max_mmr: 999999}
  ],
  // Y6S3 - Y7S3 | #23 - #27 | Crystal Guard - Brutal Swarm
  v5: [
    {name: "Unranked", min_mmr: 0, max_mmr: 0},
    {name: "Copper 5", min_mmr: 1, max_mmr: 1199},
    {name: "Copper 4", min_mmr: 1200, max_mmr: 1299},
    {name: "Copper 3", min_mmr: 1300, max_mmr: 1399},
    {name: "Copper 2", min_mmr: 1400, max_mmr: 1499},
    {name: "Copper 1", min_mmr: 1500, max_mmr: 1599},
    {name: "Bronze 5", min_mmr: 1600, max_mmr: 1699},
    {name: "Bronze 4", min_mmr: 1700, max_mmr: 1799},
    {name: "Bronze 3", min_mmr: 1800, max_mmr: 1899},
    {name: "Bronze 2", min_mmr: 1900, max_mmr: 1999},
    {name: "Bronze 1", min_mmr: 2000, max_mmr: 2099},
    {name: "Silver 5", min_mmr: 2100, max_mmr: 2199},
    {name: "Silver 4", min_mmr: 2200, max_mmr: 2299},
    {name: "Silver 3", min_mmr: 2300, max_mmr: 2399},
    {name: "Silver 2", min_mmr: 2400, max_mmr: 2499},
    {name: "Silver 1", min_mmr: 2500, max_mmr: 2599},
    {name: "Gold 3", min_mmr: 2600, max_mmr: 2799},
    {name: "Gold 2", min_mmr: 2800, max_mmr: 2999},
    {name: "Gold 1", min_mmr: 3000, max_mmr: 3199},
    {name: "Platinum 3", min_mmr: 3200, max_mmr: 3499},
    {name: "Platinum 2", min_mmr: 3500, max_mmr: 3799},
    {name: "Platinum 1", min_mmr: 3800, max_mmr: 4099},
    {name: "Diamond 3", min_mmr: 4100, max_mmr: 4399},
    {name: "Diamond 2", min_mmr: 4400, max_mmr: 4699},
    {name: "Diamond 1", min_mmr: 4700, max_mmr: 4999},
    {name: "Champions", min_mmr: 5000, max_mmr: 999999}
  ],
  // Y7S4+ | #28+ | Solar Raid+ (Ranked 2.0)
  v6: [
    {min_mmr: 0,    max_mmr: 999,  name: "Unranked"},
    {min_mmr: 1000, max_mmr: 1099, name: "Copper 5"},
    {min_mmr: 1100, max_mmr: 1199, name: "Copper 4"},
    {min_mmr: 1200, max_mmr: 1299, name: "Copper 3"},
    {min_mmr: 1300, max_mmr: 1399, name: "Copper 2"},
    {min_mmr: 1400, max_mmr: 1499, name: "Copper 1"},
    {min_mmr: 1500, max_mmr: 1599, name: "Bronze 5"},
    {min_mmr: 1600, max_mmr: 1699, name: "Bronze 4"},
    {min_mmr: 1700, max_mmr: 1799, name: "Bronze 3"},
    {min_mmr: 1800, max_mmr: 1899, name: "Bronze 2"},
    {min_mmr: 1900, max_mmr: 1999, name: "Bronze 1"},
    {min_mmr: 2000, max_mmr: 2099, name: "Silver 5"},
    {min_mmr: 2100, max_mmr: 2199, name: "Silver 4"},
    {min_mmr: 2200, max_mmr: 2299, name: "Silver 3"},
    {min_mmr: 2300, max_mmr: 2399, name: "Silver 2"},
    {min_mmr: 2400, max_mmr: 2499, name: "Silver 1"},
    {min_mmr: 2500, max_mmr: 2599, name: "Gold 5"},
    {min_mmr: 2600, max_mmr: 2699, name: "Gold 4"},
    {min_mmr: 2700, max_mmr: 2799, name: "Gold 3"},
    {min_mmr: 2800, max_mmr: 2899, name: "Gold 2"},
    {min_mmr: 2900, max_mmr: 2999, name: "Gold 1"},
    {min_mmr: 3000, max_mmr: 3099, name: "Platinum 5"},
    {min_mmr: 3100, max_mmr: 3199, name: "Platinum 4"},
    {min_mmr: 3200, max_mmr: 3299, name: "Platinum 3"},
    {min_mmr: 3300, max_mmr: 3399, name: "Platinum 2"},
    {min_mmr: 3400, max_mmr: 3499, name: "Platinum 1"},
    {min_mmr: 3500, max_mmr: 3599, name: "Emerald 5"},
    {min_mmr: 3600, max_mmr: 3699, name: "Emerald 4"},
    {min_mmr: 3700, max_mmr: 3799, name: "Emerald 3"},
    {min_mmr: 3800, max_mmr: 3899, name: "Emerald 2"},
    {min_mmr: 3900, max_mmr: 3999, name: "Emerald 1"},
    {min_mmr: 4000, max_mmr: 4099, name: "Diamond 5"},
    {min_mmr: 4100, max_mmr: 4199, name: "Diamond 4"},
    {min_mmr: 4200, max_mmr: 4299, name: "Diamond 3"},
    {min_mmr: 4300, max_mmr: 4399, name: "Diamond 2"},
    {min_mmr: 4400, max_mmr: 4499, name: "Diamond 1"},
    {min_mmr: 4500, max_mmr: 999999, name: "Champions"}
  ],
};
