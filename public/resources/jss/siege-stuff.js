let operatorDict = {
  kapkan: { 
    year: "Y0S0",
    health: 2,
    unit: "SPETSNAZ",
    countryCode: "RU",
    roles: ["Trap"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/FLgwGbMiZTrWcK62KxPq8/d4e584420f85fa61c09e5e57e12d9dd9/Entry-Denial-Device.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7MofnDHeL1uwsenBVjxplQ/1e5af8fe9cf6f36516c7f6e5d56fcac0/r6-operators-list-kapkan.png",
    iconImageURL: "https://i.imgur.com/YHj9igl.png"
  },
  tachanka: { 
    year: "Y0S0",
    health: 3,
    unit: "SPETSNAZ",
    countryCode: "RU",
    roles: ["Anchor", "Covering Fire", "Shield"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/37wX75QnY7XA6KbjM4aF5n/0ab116d398cf71463e11d43913818ec1/Shumikha-Launcher.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5P9kGyOrnsu7lRyr9xC71t/53981da03fa36adf99adf61bc098bd4a/r6s-operators-list-tachanka.png",
    iconImageURL: "https://i.imgur.com/VTUCIZH.png"
  },
  glaz: { 
    year: "Y0S0",
    health: 2,
    unit: "SPETSNAZ",
    countryCode: "RU",
    roles: ["Back Line", "Covering Fire", "Soft Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/73bNPGhlIuhlWvi497sYqE/b68414436088f62f9da44cd42f702df7/Flip-Sight.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6R6uQlUmkh7KYoFYeeGpvj/fb92cfe1a0501d63a0ffa417c004e84e/r6-operators-list-glaz.png",
    iconImageURL: "https://i.imgur.com/7vFvnxZ.png"
  },
  fuze: { 
    year: "Y0S0",
    health: 3,
    unit: "SPETSNAZ",
    countryCode: "RU",
    roles: ["Area Denial", "Disable", "Flank"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3YaoPPUbFYeVSCemdj57EL/a4a4a8c0a935640f7d9a1d1ea82bc48c/Cluster-Charge.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/BsiNYFp7htro1mOEgiKf1/eef48a78d9a7c1cb2dcac07e1d06edb1/r6-operators-list-fuze.png",
    iconImageURL: "https://i.imgur.com/xsVA73Z.png"
  },
  iq: { 
    year: "Y0S0",
    health: 1,
    unit: "GSG9",
    countryCode: "DE",
    roles: ["Disable", "Flank", "Front Line", "Intel Gatherer"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/23Nk2ie06rb3DcZnStryIY/e06226196dd582c905c33fad87dfdd63/Electronics-Detector.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3lP88YKPk0boUyisZD0LT7/6b3ef86531c459ef9e573f056d6eddf5/r6-operators-list-iq.png",
    iconImageURL: "https://i.imgur.com/M1NaKKv.png"
  },
  blitz: { 
    year: "Y0S0",
    health: 2,
    unit: "GSG9",
    countryCode: "DE",
    roles: ["Anti Roam", "Crowd Control", "Front Line", "Shield"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7EXDIOjPFMhPKZWY5OcEQC/f2df48ebe5673dca7773d81efd940b66/Flash-Shield.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4NZvCtXwtcCq1s65H7mK5y/8d70872df8319e1d162a31bbf404ed2c/r6-operators-list-blitz.png",
    iconImageURL: "https://i.imgur.com/GxXncfV.png"
  },
  bandit: { 
    year: "Y0S0",
    health: 1,
    unit: "GSG9",
    countryCode: "DE",
    roles: ["Anti Hard Breach", "Roam", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/129HTNU2A5kIcMj0KZ5UjU/858b60dd0e9b8692e2dc693eded50e14/Shock-Wire.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2cFHG0Xk93uoGrm5nTjDPE/2211339df9b36c1b0d9873e480d03fad/r6-operators-list-bandit.png",
    iconImageURL: "https://i.imgur.com/p6tWAW7.png"
  },
  jager: { 
    year: "Y0S0",
    health: 2,
    unit: "GSG9",
    countryCode: "DE",
    roles: ["Roam", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1YCujceutAcJ7F10yhHC41/c5f870e7789b6396c9997ed45ccd3beb/Active-Defense-System.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4kMW2lcoewGifRWbvQVjKy/8f974b5d26db81dc823ea602e31d6273/r6-operators-list-jager.png",
    iconImageURL: "https://i.imgur.com/Y8EjdSy.png"
  },
  rook: { 
    year: "Y0S0",
    health: 3,
    unit: "GIGN",
    countryCode: "FR",
    roles: ["Anchor", "Buff"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/MeoKw7iPY6EFYvjS07CRg/b2d7eba623f3c63d6b7097a8f2253954/Armor-Pack.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1aFTx0BJYAKAnS1vyNA7w6/b4fc6421d382c677aa0197f84131eaa5/r6-operators-list-rook.png",
    iconImageURL: "https://i.imgur.com/UQK1UNc.png"
  },
  doc: { 
    year: "Y0S0",
    health: 3,
    unit: "GIGN",
    countryCode: "FR",
    roles: ["Anchor", "Buff"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7njaeUjJj27iYH27HnH6jn/c5533d2d7191b879c313013f278f5f59/Stim-Pistol.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2sCxLIpS9I19PKRz44Phj9/4f96411a556cc41597b8b3e83260cd21/r6-operators-list-doc.png",
    iconImageURL: "https://i.imgur.com/19gitiC.png"
  },
  twitch: { 
    year: "Y0S0",
    health: 2,
    unit: "GIGN",
    countryCode: "FR",
    roles: ["Back Line", "Disable", "Front Line", "Intel Gatherer"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5dZ9kaUfUSF3piuFIUKf2t/7ebfc51caee42a776492b56251d45d92/Shock-Drones.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/Z9R1Anc8MHwbG5iyPoOf2/69fe9aee30e03322a4e09d4b87de15aa/r6-operators-list-twitch.png",
    iconImageURL: "https://i.imgur.com/jc5pPPK.png"
  },
  montagne: { 
    year: "Y0S0",
    health: 3,
    unit: "GIGN",
    countryCode: "FR",
    roles: ["Shield"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1bmXJOakdA6SOrGxBKA70T/1e489e366d6db287f475963df2040d3d/Extendable-Shield.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1hxlGxmToB93urkgbIzUvW/fa894cd6ab38358284a3a1858cabbeee/r6-operators-list-montagne.png",
    iconImageURL: "https://i.imgur.com/bzzVRTU.png"
  },
  thermite: { 
    year: "Y0S0",
    health: 2,
    unit: "SWAT",
    countryCode: "US",
    roles: ["Back Line", "Hard Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/R5giHT90R2XOMMuUENZeK/840a5a391ed57a0c62208e72258407a7/Exothermic-Charge.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3NQW8lJVslVSaYSiBlAleU/09fd8e3e946f2e71f39182b9ff18dd77/r6-operators-list-thermite.png",
    iconImageURL: "https://i.imgur.com/o896oL9.png"
  },
  pulse: { 
    year: "Y0S0",
    health: 1,
    unit: "SWAT",
    countryCode: "US",
    roles: ["Intel Gatherer", "Roam"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7dPXIadD3D2a3uEqrCPvj2/103ad9d0d3b71adee3b92a5db96fe24d/Heartbeat-Sensor.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1YQb5phSD3uYbWrqhCBJRU/06e5f689777224bf8ca6c7c5cad9db9d/r6-operators-list-pulse.png",
    iconImageURL: "https://i.imgur.com/Y2iDnWq.png"
  },
  castle: { 
    year: "Y0S0",
    health: 2,
    unit: "SWAT",
    countryCode: "US",
    roles: ["Anchor", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/29N9nMqB8ZZxGCPz128ccD/439cb1fcb2f6d5385378cf073a5fbc30/Armor-Panel.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1ETv9XcrmgbAdYWDJ2ZIh0/3f5ad7d030ee411c041c524880176603/r6-operators-list-castle.png",
    iconImageURL: "https://i.imgur.com/Fv8G4RW.png"
  },
  ash: { 
    year: "Y0S0",
    health: 1,
    unit: "SWAT",
    countryCode: "US",
    roles: ["Disable", "Flank", "Front Line", "Soft Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/0114WqhzsMsnvaKc4FypkN/5ebb9b86e216a2d9e6b2ea01eb3346e8/Breaching-Rounds.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/QOEBDfqjtUxVBc31l8L9f/4d9b112565baf81d56d69279b95cd463/r6-operators-list-ash_317253.png",
    iconImageURL: "https://i.imgur.com/ml0tMs3.png"
  },
  thatcher: { 
    year: "Y0S0",
    health: 2,
    unit: "SAS",
    countryCode: "GB",
    roles: ["Back Line", "Disable"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4p4srpOH4sq55OHryHhn5t/d31728d1432ed28c429ea566caf0e083/EMP-Grenade.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5QGPM6l25ybaINnaIaLgvm/d018abc75d44758d666ad6bea0a38a9b/r6-operators-list-thatcher.png",
    iconImageURL: "https://i.imgur.com/BuEp8mz.png"
  },
  smoke: { 
    year: "Y0S0",
    health: 2,
    unit: "SAS",
    countryCode: "GB",
    roles: ["Anchor", "Area Denial", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3ZbADU6FxBqdvcA8vCpYhn/6c69d61202364fa420e2a319d817c6f3/Remote-Gas-Grenade.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2Tm9rzdq6j9cpdW9qjnnrw/10d42d14755002e1056d1a940841482c/r6-operators-list-smoke.png",
    iconImageURL: "https://i.imgur.com/aodW3TF.png"
  },
  sledge: { 
    year: "Y0S0",
    health: 2,
    unit: "SAS",
    countryCode: "GB",
    roles: ["Flank", "Soft Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2Vyo9CrQ1J7IZe43XpT4pV/4bc02e829d1b1745b9a527ff34f8fafb/Tactical-Breaching-Hammer.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6eIdbZWLBIdtCygNAu9uue/8856e29f0e9ebc3b6ed996223586ebce/r6-operators-list-sledge.png",
    iconImageURL: "https://i.imgur.com/JXV80ZY.png"
  },
  mute: { 
    year: "Y0S0",
    health: 2,
    unit: "SAS",
    countryCode: "GB",
    roles: ["Anti Hard Breach", "Intel Denier", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1M5fsUELbaAzImzMte2ESa/9de588693ec317c87ef1a2021bd43b86/Signal-Disruptor.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4BWoDVmdDsgrI071YJwqyF/4bcf11da1e22bda96d130a0f0d4d5b48/r6-operators-list-mute.png",
    iconImageURL: "https://i.imgur.com/peaKoO1.png"
  },
  frost: { 
    year: "Y1S1",
    health: 2,
    unit: "JTF2",
    countryCode: "CA",
    roles: ["Crowd Control", "Trap"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/xsIzH7XCAqvn7F3tEfAPe/c41e59a9d7f2ed7ee38b16ed0a882351/Welcome-Mate.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/33qvDwvWy7y9VGw9k1RYWi/73c4b6e46575b2b649058e2e626c223a/r6-operators-list-frost.png",
    iconImageURL: "https://i.imgur.com/FTbAE33.png"
  },
  buck: { 
    year: "Y1S1",
    health: 2,
    unit: "JTF2",
    countryCode: "CA",
    roles: ["Flank", "Soft Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2w8EQtN4FFtEMa9lBYyWGg/36bbc6d819761c11418c868d2e483991/Skeleton-Key.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3k68pZu62GPbCAFOSCej9a/3c3d3da1f7109a396fb59dcf06c5c4c8/r6-operators-list-buck.png",
    iconImageURL: "https://i.imgur.com/u9slUlM.png"
  },
  valkyrie: { 
    year: "Y1S2",
    health: 2,
    unit: "NAVY SEAL",
    countryCode: "US",
    roles: ["Intel Gatherer", "Roam"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1EPfd4xeuMpt5nItOYm2Eb/b59223248a508d205264ece3c3553d36/Black-Eye.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7xN3HJXPLVEmWA9PDnQzTV/613b19a897503161f2cf6fe7bbe3408e/r6-operators-list-valkyrie.png",
    iconImageURL: "https://i.imgur.com/xJHdqA3.png"
  },
  blackbeard: { 
    year: "Y1S2",
    health: 2,
    unit: "NAVY SEAL",
    countryCode: "US",
    roles: ["Back Line", "Covering Fire", "Shield"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2dZeBTlDDdFQKb4PYb8F5v/162d60178a75cde9f65be362eacc880a/Rifle-Shield.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5u6Ak7dkTb4yOjaP1hlGuT/0cdd45963fd8c83c62f609c7319bbf05/r6-operators-list-blackbeard.png",
    iconImageURL: "https://i.imgur.com/BOAh5x8.png"
  },
  caveira: { 
    year: "Y1S3",
    health: 1,
    unit: "BOPE",
    countryCode: "BR",
    roles: ["Intel Denier", "Intel Gatherer", "Roam"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6PTsBBBGTT5oixxzvYv1Y4/18e31c74ba1ca73ed2694134acd9c078/Silent-Step.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4RZ2Vwk7HozKMCtS5gFMp7/e1b930e3c80590a316939d9df0d88660/r6-operators-list-caveira.png",
    iconImageURL: "https://i.imgur.com/IeYRobc.png"
  },
  capitao: { 
    year: "Y1S3",
    health: 1,
    unit: "BOPE",
    countryCode: "BR",
    roles: ["Area Denial", "Flank", "Front Line"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5ur3NZUGos3i2HR8f0HIzj/46cf23c97453ebfedeaa42a1088ff32f/Tactical-Crossbow.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3AZlhNFA21aKL2MdAIEwa8/abfce9018a7a08c120d707fbc28ae709/r6-operators-list-capitao.png",
    iconImageURL: "https://i.imgur.com/gBmMrMa.png"
  },
  echo: { 
    year: "Y1S4",
    health: 3,
    unit: "S.A.T.",
    countryCode: "JP",
    roles: ["Anchor", "Crowd Control", "Intel Gatherer", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/TdDZyrKpjt9EQo8tHpIJk/d987db4da22046a0663be8be82dcda88/Yokai.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7MdVMpafww11MfSVMEzyTK/4d4c5d92585c7cf11a28cbf9456e3d9e/r6-operators-list-echo.png",
    iconImageURL: "https://i.imgur.com/OMNe9qB.png"
  },
  hibana: { 
    year: "Y1S4",
    health: 1,
    unit: "S.A.T.",
    countryCode: "JP",
    roles: ["Back Line", "Front Line", "Hard Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1QSzVxpGhswXix3vn8XGKj/c4f64fa0895bdaf164448e3ae49950a0/X-Kairos.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7mAs4mz2zA4wjPZsNg6tys/e4fbdbfe20406c2655b56ba420b839aa/r6-operators-list-hibana.png",
    iconImageURL: "https://i.imgur.com/aqOOm2R.png"
  },
  mira: { 
    year: "Y2S1",
    health: 3,
    unit: "G.E.O.",
    countryCode: "ES",
    roles: ["Anchor", "Intel Gatherer", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1a1w8epOhWE8VtzvvCJG9d/b20cbb221f7d45e5838f839ce042f409/Black-mirror.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2Q9Y4UXzkQfECOw5fX3QrI/bfd6532c840cb06a22e0196f2acfc462/r6-operators-list-mira.png",
    iconImageURL: "https://i.imgur.com/gOnJqiF.png"
  },
  jackal: { 
    year: "Y2S1",
    health: 2,
    unit: "G.E.O.",
    countryCode: "ES",
    roles: ["Anti Roam", "Intel Gatherer"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2gexf5zLDsa74J7urCoDxk/50da09626395cbe1bf2a58e00a57a514/Eyenox-Model-III.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/kbyJly2JDRxFrjFSrptiy/ebbdae24cdfed025b0872742bb6c2a96/r6-operators-list-jackal.png",
    iconImageURL: "https://i.imgur.com/cGBKp2a.png"
  },
  lesion: { 
    year: "Y2S3",
    health: 2,
    unit: "S.D.U",
    countryCode: "HK",
    roles: ["Anchor", "Crowd Control", "Intel Gatherer", "Roam", "Trap"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6PJv86R8CtQCWA7a24sJE2/24f3751b2ed941ce80a4c1ef394ab7d5/Gu-mines.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3woPDn0yMuXfkr2RYoymFj/964dfe9277e5299b0125c33b39e165d1/r6-operators-list-lesion.png",
    iconImageURL: "https://i.imgur.com/IvYOwrI.png"
  },
  ying: { 
    year: "Y2S3",
    health: 2,
    unit: "S.D.U",
    countryCode: "HK",
    roles: ["Crowd Control", "Front Line"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4vpN9vu5wD9dyb2knMosTy/430796de3c0c2a5c2eb2ac6f4217eba0/Candela.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/36BxtuVTQFrNh2OPyJ2px3/6db32fa8151b9a925acdd65d289bcf0f/r6-operators-list-ying.png",
    iconImageURL: "https://i.imgur.com/BHUvTt4.png"
  },
  dokkaebi: { 
    year: "Y2S4",
    health: 2,
    unit: "707TH SMB",
    countryCode: "SK",
    roles: ["Anti Roam", "Flank", "Intel Denier", "Intel Gatherer"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5ej2g1iCMHdfjn8h8qgfmU/bf07fef4b063a46389ca650ed02b292a/Logic-Bomb.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7fjUupLXClpcdTyqdvPv24/e4492917c18682ef09f9b0445176b2f2/r6-operators-list-dokkaebi.png",
    iconImageURL: "https://i.imgur.com/iVLOHr2.png"
  },
  vigil: { 
    year: "Y2S4",
    health: 1,
    unit: "707TH SMB",
    countryCode: "SK",
    roles: ["Intel Denier", "Roam"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6WbhiNk0evsKWChPneCES6/af08476e2f917878e0326727d2d5fb8a/ERC-7.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/48ebOPwZWlyktdhawglqlI/819d0565c7f545e97526e4dda0a2f129/r6-operators-list-vigil.png",
    iconImageURL: "https://i.imgur.com/WkqMEZ6.png"
  },
  zofia: { 
    year: "Y2S4",
    health: 2,
    unit: "G.R.O.",
    countryCode: "PL",
    roles: ["Anti Roam", "Crowd Control", "Disable", "Flank", "Soft Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1elqIEWJ6XsXKAbMNd0Cai/0b4c0591bad284d957e652cdae0b706b/KS79-Lifeline.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/z60t1OJxJoHqm2zp0t5dL/4acc0904444f43b12a17f6a578322cf9/r6-operators-list-zofia.png",
    iconImageURL: "https://i.imgur.com/AMOYwMJ.png"
  },
  ela: { 
    year: "Y2S4",
    health: 1,
    unit: "G.R.O.",
    countryCode: "PL",
    roles: ["Crowd Control", "Roam", "Trap"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/10Md7ccaUO0pE0nCWimeoZ/35dddc67a4141e844d7904051a0314dc/Grzmot-Mine.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6110n4X8KghHzBtPrksrKD/28e78ce725b3d1cd35c6f0967c0524b8/r6-operators-list-ela.png",
    iconImageURL: "https://i.imgur.com/OwjSJNB.png"
  },
  lion: { 
    year: "Y3S1",
    health: 2,
    unit: "GIGN",
    countryCode: "FR",
    roles: ["Anti Roam", "Back Line", "Crowd Control", "Intel Gatherer"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7fRknnWl2K2qjKle1t79j/0506d25798aeb0691c8a576665050f7d/EE-ONE-D.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4wYSIOO4AKq0nw1GbulGns/fcd32bda72facd7062a25ad3764f21e9/r6-operators-list-lion.png",
    iconImageURL: "https://i.imgur.com/0zCtOUO.png"
  },
  finka: {
    year: "Y3S1",
    health: 2,
    unit: "SPETSNAZ",
    countryCode: "RU",
    roles: ["Back Line", "Buff"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/9xGRNPNznBKssvgQAtQNQ/9352fc88f2911ab40789412856b3e20e/Adrenal-Surge.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6VkZ60XV4HWhbQaoMpfjnw/1bd7667a572622371627e90e5e572455/r6-operators-list-finka.png",
    iconImageURL: "https://i.imgur.com/dxqOJu3.png"
  }, 
  alibi: {
    year: "Y3S2",
    health: 1,
    unit: "G.I.S.",
    countryCode: "IT",
    roles: ["Intel Denier", "Intel Gatherer", "Roam", "Trap"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7sJYir66zAPq2omSvYeT2u/8fbe3370d32fb5433fb6d3a86d46a1b9/Prisma.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/11nzEgSwdAXLow3kPl0wom/3fdf2b0aa1c1af7ef785d28cf5d80114/r6-operators-list-alibi.png",
    iconImageURL: "https://i.imgur.com/Phb6OUU.png"
  },
  maestro: {
    year: "Y3S2",
    health: 3,
    unit: "G.I.S.",
    countryCode: "IT",
    roles: ["Anchor", "Area Denial", "Intel Gatherer", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/n2rfPidCv630jQEfnEWwb/42d454d0771218eb8f27f6d17d8a073e/Evil-Eye.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6QNXf9qRkqzOdsprj2SWgI/0c4cc3b9423cada4fed0ba5ae2c9c722/r6-operators-list-maestro.png",
    iconImageURL: "https://i.imgur.com/PQ8VBAF.png"
  },
  clash: {
    year: "Y3S3",
    health: 3,
    unit: "MPS",
    countryCode: "GB",
    roles: ["Crowd Control", "Intel Gatherer", "Secure", "Shield"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1jck6fnzAMbMQrUMVsnA0M/d04a60eab0132e6bcc202a4f99186cdd/CCE-Shield.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3tTgRbA9GdeLTmI1mPObsp/5b490d1e9021c37ffa59f3e6bc6f8c7e/r6-operators-list-clash.png",
    iconImageURL: "https://i.imgur.com/eogGdHx.png"
  },
  maverick: {
    year: "Y3S3",
    health: 1,
    unit: "THE UNIT",
    countryCode: "US",
    roles: ["Back Line", "Disable", "Flank", "Hard Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4rPBvxDKsKiQCMjt7GxJMw/09e45c68bbc41c1721acbbe0257e2465/Breaching-Torch.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1MmaEupq7KOe6it1trqIWP/3f4246349a36e28f4d9299f9368612c1/r6-operators-list-maverick.png",
    iconImageURL: "https://i.imgur.com/8hXt5z6.png"
  },
  kaid: {
    year: "Y3S4",
    health: 3,
    unit: "GIGR",
    countryCode: "MA",
    roles: ["Anchor", "Anti Hard Breach", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7rUOk2LhYIUjvYLot7GT8Y/94b72bfbbfdf50c2c807cdbf9f5b276e/Rtila-Electroclaw.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/9ATWPlasUTzxyJMNlV9SM/16dd669d06990b12088660ffc77bd6b3/r6-operators-list-kaid.png",
    iconImageURL: "https://i.imgur.com/Du1aa9i.png"
  },
  nomad: {
    year: "Y3S4",
    health: 2,
    unit: "GIGR",
    countryCode: "MA",
    roles: ["Anti Roam", "Crowd Control", "Trap"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6d0LN1QWzviEkcYu3mTn6v/e49511a479756f71224f14225ad9cbd8/Airjab-Launcher.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3VHhiyMOUkBOW1u1Zh5eGH/9e603d3e6926fc26ebee494b3040eba7/r6-operators-list-nomad.png",
    iconImageURL: "https://i.imgur.com/2I6OWIz.png"
  },
  gridlock: {
    year: "Y4S1",
    health: 3,
    unit: "SASR",
    countryCode: "AN",
    roles: ["Anti Roam", "Area Denial", "Crowd Control"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/QGVvmZeZ91FC2X4mvMzgn/601fa45e635872aea31f15ffebb9c366/Trax-Stingers.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/27gUsHtPmP86NRs4cPug1o/31ea0005ad1afc68a8ebcc477934ded6/r6-operators-list-gridlock.png",
    iconImageURL: "https://i.imgur.com/WHkIm3H.png"
  },
  mozzie: {
    year: "Y4S1",
    health: 2,
    unit: "SASR",
    countryCode: "AN",
    roles: ["Intel Denier", "Intel Gatherer", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5L0fFKVOwozKMcmJoenfef/56e4efdf77363556b35a76fd4e0e60f6/Pest-Launcher.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5NwXzotdPIQuvWugaam4JA/eaf8febf1432c5f2f015318c83890d93/r6-operators-list-mozzie_343537.png",
    iconImageURL: "https://i.imgur.com/yrFXGCn.png"
  },
  nokk: {
    year: "Y4S2",
    health: 2,
    unit: "JAEGER CORPS",
    countryCode: "DK",
    roles: ["Flank", "Intel Denier"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/57miqbOn8xWBh7ne7za3CV/35364108d49380a0ed33998f970e104f/HEL-Presence-Reduction.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/VeXso9iKMqBDrSmuJ2kBx/b8020ed099ddbdcb31ec809b9d7da152/r6-operators-list-nokk.png",
    iconImageURL: "https://i.imgur.com/oleTyHs.png"
  },
  warden: {
    year: "Y4S2",
    health: 2,
    unit: "SECRET SERVICE",
    countryCode: "US",
    roles: ["Anchor", "Intel Denier"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/40RkJUEmmBCf7bmfTL8ao1/1d973adfe4d002c94655d9818776fb41/Glance-Smart-Glasses.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/72pEJEYxwPGoW221XvdmAJ/ea79dbd58064cbc99a1514e1b1641586/r6-operators-list-warden.png",
    iconImageURL: "https://i.imgur.com/HqTIR7x.png"
  },
  amaru: {
    year: "Y4S3",
    health: 2,
    unit: "APCA",
    countryCode: "PE",
    roles: ["Flank", "Front Line"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3WejtMAtiITfpjDMuq6j4t/b52e58da6b2625839aa23f940c8e6639/Garra-Hook.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5jumFHxGXFA7HehPNn0uGD/e00f3d67802944d0c7aba72455e1ba6a/r6-operators-list-amaru.png",
    iconImageURL: "https://i.imgur.com/m5u47Mw.png"
  },
  goyo: {
    year: "Y4S3",
    health: 2,
    unit: "FES",
    countryCode: "MX",
    roles: ["Area Denial", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1JqlRdbaVA73jDq8y46vX4/82e89f39c479526ace294ba246d0b085/Volcan-Shield.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1ylXIr2TxRcFMSKfRhXJXh/5202b0fdfbf43545e8c40a8232a438c3/r6-operators-list-goyo.png",
    iconImageURL: "https://i.imgur.com/tYPrtCH.png"
  },
  kali: {
    year: "Y4S4",
    health: 2,
    unit: "NIGHTHAVEN",
    countryCode: "IN",
    roles: ["Back Line", "Covering Fire", "Disable"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/75eebt48ELO4eGGdIMVMpY/9533c7dc8f36651f5b5ad50c8ccb6c5a/LV_Explosive_Lance.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/41NACeIbkdnIWgnwq0HzD4/9713f8e58b9a8c253b7507b59169bb3c/r6-operators-list-kali_358317.png",
    iconImageURL: "https://i.imgur.com/sQGypuE.png"
  },
  wamai: {
    year: "Y4S4",
    health: 2,
    unit: "NIGHTHAVEN",
    countryCode: "KE",
    roles: ["Anchor", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1IKNZzLv63AJd9vlbXj3Bo/883371432ffb22e5bf35bc82dd706384/Mag-net_System.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2ZSUcKWczIo1w2WwzNan5B/98938e59a958117b46901c57fce98ae7/r6-operators-list-wamai_358318.png",
    iconImageURL: "https://i.imgur.com/bFRCKTJ.png"
  },
  iana: {
    year: "Y5S1",
    health: 2,
    unit: "REU",
    countryCode: "NL",
    roles: ["Intel Denier", "Intel Gatherer"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/K8E4EHWbD8wTjVqro6wVl/62339b2fbe1d3a2319dcd320f7a0b070/r6s-operator-ability-iana.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6vES8lEllMwW9OaBYRT7YX/39b5fe90684d7ce637a7d025cdd1ec96/r6s-operator-list-iana.png",
    iconImageURL: "https://i.imgur.com/bk77LOt.png"
  },
  oryx: {
    year: "Y5S1",
    health: 2,
    unit: "UNAFFILIATED",
    countryCode: "JO",
    roles: ["Roam", "Soft Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3dM2B3qCdU0woydIbiy2xn/55aa99443002ad794d3f78dada26d035/r6s-operator-ability-oryx.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3JBOp3MXgGeuEwyoYrkuMi/b7aa3c4a3fa6f165135954aa30252838/r6s-operator-list-oryx.png",
    iconImageURL: "https://i.imgur.com/BdJnmYf.png"
  },
  ace: {
    year: "Y5S2",
    health: 2,
    unit: "NIGHTHAVEN",
    countryCode: "NO",
    roles: ["Front Line", "Hard Breach"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/2sjKOnwHeOX2xn3iIpja2A/e265f675c905ac25c23ed11fc85589bb/r6s-operator-ability-ace.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/5snW47tH4a5VuPhidr61sm/40b812d32eb85b5c3390865541578bea/r6s-operator-list-ace.png",
    iconImageURL: "https://i.imgur.com/GwWGSuu.png"
  },
  melusi: {
    year: "Y5S2",
    health: 1,
    unit: "ITF",
    countryCode: "SA",
    roles: ["Crowd Control", "Intel Gatherer", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/49ixqWhGgjvHu0Ay8JzeSH/c6a3fe584847850186e15c7fb4244385/r6s-operator-ability-melusi.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1yoVAGw5rEQ8zPPHoQSDJb/b16a570fadb3342416c5c44847cc651a/r6s-operator-list-melusi.png",
    iconImageURL: "https://i.imgur.com/7BNXQnr.png"
  },
  zero: {
    year: "Y5S3",
    health: 2,
    unit: "ROS",
    countryCode: "US",
    roles: ["Intel Denier", "Intel Gatherer"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6h4hyVSzG8IwAmEl1Objrd/6e51e64eeffcc68746b8ff59445fb103/r6s-operator-ability-zero.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/24jDQIfDdVMLX5K54pKNe5/58dec3b1e7d32a637bc76560e0cf0385/r6s-operator-list-zero.png",
    iconImageURL: "https://i.imgur.com/87LCqv1.png"
  },
  aruni: {
    year: "Y5S4",
    health: 2,
    unit: "NIGHTHAVEN",
    countryCode: "TH",
    roles: ["Secure", "Intel Gatherer", "Anchor"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4hLJAAVKrf50wosG0471od/cde1867daf863c03754969f159ac00de/r6s-operator-ability-aruni.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4yfuWCW8O4ja2VqR9tXqaE/c8dd123a6405959cf4f091c3854c9d96/r6s-operators-list-aruni.png",
    iconImageURL: "https://i.imgur.com/PhCM38D.png"
  },
  flores: {
    year: "Y6S1",
    health: 2,
    unit: "UNAFFILIATED",
    countryCode: "AR",
    roles: ["Soft Breach", "Disable", "Area Denial", "Back Line"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1z7eSI5D8IRIOHi0PJu4yq/3c4a273098a840957a248583f73fa8ff/r6s-operator-ability-flores.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3hXRjYHsrlFOocJjyxyYZY/29eb8f1ad9eab150518a053b775c336f/r6s-operators-list-flores.png",
    iconImageURL: "https://i.imgur.com/1wBdB2q.png"
  },
  thunderbird: {
    year: "Y6S2",
    health: 1,
    unit: "UNAFFILIATED",
    countryCode: "",
    roles: ["Secure", "Roam", "Buff"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/67J9QnmuA4TMI3rBxoA3Jz/4ec42d8c1bb61dadc5f36893f93142e8/r6s-operator-ability-thunderbird.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3gadEIZqtSfsHstfPMe3bz/424c7e4c21276e99f41a8c75478aa5e5/r6s-operators-list-thunderbird.png",
    iconImageURL: "https://i.imgur.com/21vn9y7.png"
  },
  osa: {
    year: "Y6S3",
    health: 2,
    unit: "NIGHTHAVEN",
    countryCode: "HR",
    roles: ["Intel Gatherer", "Area Denial", "Anti Roam"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/71VBmyDtBAx788WnNJfEgo/1e6d78a81f8dc381bf4244b87970038f/r6s-operator-ability-osa.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3Dg95rvyhPtw588r60vIPM/75e609068a0b205cc4dbc7bf3e517f51/r6s-operators-list-osa.png",
    iconImageURL: "https://i.imgur.com/WjvbwYD.png"
  },
  thorn: {
    year: "Y6S4",
    health: 2,
    unit: "GARDA SÍOCHÁNA",
    countryCode: "IE",
    roles: ["Anchor", "Secure"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/38hUQdWTb1vgs0Yg8eQHFC/0d7f05420068a41392342a1b38c57c2e/r6s-operator-ability-thorn.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3erk7Ub0asfBDZEKsdL8j9/5019698958b0834e806d01cd7bf36286/r6s-operator-thorn.png",
    iconImageURL: "https://i.imgur.com/w5DB6xs.png"
  },
  azami: {
    year: "Y7S1",
    health: 2,
    unit: "UNAFFILIATED",
    countryCode: "JP",
    roles: ["Area Denial"],
    uniqueAbilityImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1UDhKrAXnm0thdHhsTTAyo/03f6b0b4879208d963e6d551b86ad3a6/r6s-operator-ability-azami.png",
    poseImageURL: "https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/6vzacvORn7fh5sWFqy4glF/daadcbb2e0515129bf0cb610eccb3393/r6s-operator-azami.png",
    iconImageURL: ""
  },
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
    IE: "4ZTCTE7yj5Yp1NEaLL40f1/5f61da3cf0eff0666b769585ec2a9df4/flag-ireland.png"
  };
  return `https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/${x[cc]}` || "Wrong code";
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
    startDate: "2022-03-08"
  }
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
    "unranked": "RpPdtbU",
    "undefined": "RpPdtbU",
    "copper 5": "SNSfudP",
    "copper 4": "7PiisA2",
    "copper 3": "aNCvwAI",
    "copper 2": "fUzUApd",
    "copper 1": "eGuxE0k",
    "bronze 5": "bbjMf4V",
    "bronze 4": "75IEQkD",
    "bronze 3": "GIt29R0",
    "bronze 2": "sTIXKlh",
    "bronze 1": "zKRDUdK",
    "silver 5": "CbAbvOa",
    "silver 4": "2Y8Yr11",
    "silver 3": "zNUuJSn",
    "silver 2": "utTa5mq",
    "silver 1": "27ISr4q",
    "gold 4": "YIWWNzf",
    "gold 3": "JJvq35l",
    "gold 2": "Fco8pIl",
    "gold 1": "m8FFWGi",
    "platinum 3": "GpEpkDs",
    "platinum 2": "P8IO0Sn",
    "platinum 1": "52Y4EVg",
    "diamond 3": "HHPc5HQ",
    "diamond 2": "HHPc5HQ",
    "diamond 1": "HHPc5HQ",
    "champion": "QHZFdUj"
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
