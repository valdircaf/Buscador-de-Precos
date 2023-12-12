chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.values) {
    const content = document.querySelector(".content");
    const loading_page = document.querySelector("#loading-page");
    loading_page.style.display = "none";
    content.style.display = "flex";
    message.values.map((tables) => {
      const div = document.createElement("tr");
      div.innerHTML = tables;
      div.classList.add("divs");
      document.querySelector(".content-postos").appendChild(div);
    })
  }
});