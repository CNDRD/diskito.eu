function ops(a) {
  function makeVisible(c) {
    $(`#${c}`).addClass('btn-primary');
    $(`#${c}Card`).removeClass('d-none');
  };
  function makeInvisible(c) {
    $(`#${c}`).removeClass('btn-primary');
    $(`#${c}Card`).addClass('d-none');
  };

  switch (a) {
    case 'atk':
      setCookie('atk');
      makeVisible('atk');
      makeInvisible('def');
      break;
    case 'def':
      setCookie('def');
      makeVisible('def');
      makeInvisible('atk');
      break;
  }
};

COOKIE_NAME = 'last_selected_operator_side_COOKIE'

let setCookie = uhh => { localStorage.setItem(COOKIE_NAME, uhh) };
let removeLoader = () =>  $('.loader').fadeOut('slow','swing');

window.onload = function(){
  ops(localStorage.getItem(COOKIE_NAME));
  removeLoader();
};
