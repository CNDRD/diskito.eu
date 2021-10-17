const ZAKLADNI_PREHLED = "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/zakladni-prehled.min.json";
const NAKAZENI_VALECENI_UMRTI_TESTY = "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.min.json";

$.getJSON(ZAKLADNI_PREHLED, data => {
  let modified = data.modified;
  let d = data.data[0];

  $(`#provedene_testy_vcerejsi_den`).text(addSpaces(d.provedene_testy_vcerejsi_den));
  $(`#aktivni_pripady`).text(addSpaces(d.aktivni_pripady));
  $(`#aktualne_hospitalizovani`).text(addSpaces(d.aktualne_hospitalizovani));

});

$.getJSON(NAKAZENI_VALECENI_UMRTI_TESTY, data => {
  let modified = data.modified;
  let d = data.data;
  let ld = d.at(-1);

  $(`#prirustkovy_pocet_nakazenych`).text(addSpaces(ld.prirustkovy_pocet_nakazenych));
  $(`#kumulativni_pocet_nakazenych`).text(addSpaces(ld.kumulativni_pocet_nakazenych));
  $(`#prirustkovy_pocet_umrti`).text(addSpaces(ld.prirustkovy_pocet_umrti));
  $(`#kumulativni_pocet_umrti`).text(addSpaces(ld.kumulativni_pocet_umrti));
  $(`#prirustkovy_pocet_vylecenych`).text(addSpaces(ld.prirustkovy_pocet_vylecenych));
  $(`#kumulativni_pocet_vylecenych`).text(addSpaces(ld.kumulativni_pocet_vylecenych));

});
