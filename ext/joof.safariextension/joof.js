function apply(script) {
  if (document.body) {
    if (script) eval(script);
  } else {
    setTimeout(function() {
      apply(script);
    }, 200);
  }
}

var xhr = new XMLHttpRequest();
var filename = location.hostname.replace(/^www\./, "") + ".js";

xhr.open("get", "https://localhost:3131/" + filename, true);
xhr.responseType = "text";
xhr.onload = function(event) {
  apply(this.responseText);
};
xhr.send();
