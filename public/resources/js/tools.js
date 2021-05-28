function doBase64() {
  let B64text = document.base64["B64text"].value;
  let B64output = "";
  // Encode
  if(document.base64["B64encodedecode"][0].checked) {
    B64output = btoa(B64text);
  } else {
    B64output = atob(B64text);
  }
  $("#B64output").text(B64output).removeAttr("hidden");
};
