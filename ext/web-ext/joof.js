function apply(script) {
  if (document.body) {
    if (script) {
      try {
        eval(script);
      } catch (e) {
        console.groupCollapsed('%cjoof failed eval\'ing your script', 'color:red')
        console.error(e)
        console.groupEnd()
      }
    }
  } else {
    setTimeout(function() {
      apply(script);
    }, 200);
  }
}

const filename = location.hostname.replace(/^www\./, "") + ".js";

fetch('https://localhost:3131/' + filename)
  .then(resp => resp.text())
  .then(apply)
