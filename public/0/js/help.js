function zmrdus(maximus) {
  switch (maximus) {
    case 'bruce':
      makeVisible('bruce');
      makeInvisible('liquid');
      botName('Bruce');
      break;
    case 'liquid':
      makeVisible('liquid');
      makeInvisible('bruce');
      botName('Liquid');
      break;
  };
};
function makeVisible(c) {
  $(`#${c}`).addClass('btn-primary');
  $(`#${c}Cards`).removeClass('d-none');
};
function makeInvisible(c) {
  $(`#${c}`).removeClass('btn-primary');
  $(`#${c}Cards`).addClass('d-none');
};
function botName(b) {
  $(`#Bot`).text(b);
};
