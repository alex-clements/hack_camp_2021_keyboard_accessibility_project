let autofocusOn = document.getElementById("autofocus-on");
let autofocusOff = document.getElementById("autofocus-off");

autofocusOn.addEventListener("click", async () => {
  chrome.storage.local.set({"autofocus": true}, function() {
    console.log('autofocus on!');
  })
})

autofocusOff.addEventListener("click", async () => {
  chrome.storage.local.set({"autofocus": false}, function() {
    console.log('autofocus off!');
  })
})

chrome.storage.local.get("autofocus", function(data) {
  console.log(data);
  var autofocus = data.autofocus;

  if (autofocus) {
    document.getElementById("autofocus-on").checked=true;
  } else {
    document.getElementById("autofocus-off").checked=true;
  }
})