chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.values) {
    message.values.map((tables) => {
      const div = document.createElement("div");
      div.innerHTML = tables;
      div.classList.add("divs");
      document.querySelector(".content").appendChild(div);
    })
  }
});