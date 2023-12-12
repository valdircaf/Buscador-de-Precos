const main_content = document.querySelector(".main-content");
const content = document.querySelector(".content");
const loading_page = document.querySelector("#loading-page");

document.getElementById('getHTML').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      function: getTableValues,
    });
  });
  
  loading_page.style.display = "flex";
  main_content.style.display = "none";
});

async function getTableValues() {

  //SETA O SELECT COMO DIESEL S-10
  const div_navbar = document.querySelector(".rotas #filtroCombustiveis")
  const div_options = div_navbar.querySelector("div");
  const select = div_options.querySelector(".btn-group");
  const arraySelect = Array.from(select).map(option => {
    if(option.value === "28"){
      document.querySelector(".multiselect").setAttribute("title", option.innerText);
      document.querySelector(".multiselect-selected-text").innerText = option.innerText;
    }
  }) 

  //SETA A CLASSE DA LISTA DIESEL S-10 COMO ATIVA
  const options = document.querySelector(".multiselect-container");
  const lists_on_options = options.querySelectorAll("li");
  const map_lists = Array.from(lists_on_options).map(li => {
    // li.querySelector(".checkbox").textContent
    if(li.querySelector("input[value = '28']")){
      li.classList.add("active");
    }
  })
  
  //ABRE A TABELA DE POSTOS
  document.querySelector("#btnSelecionarPostorRota").click();
  const tabelaPostos = document.getElementById("tabelaPostos");

  //PEGA TODAS AS TR DENTRO DA TBODY
  const getTr = async ()=>{
    const tBody = tabelaPostos.querySelector("tbody");
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
              if(mutation.addedNodes.length === 0){
                wait(8000);
              }else{
                observer.disconnect();
                getDistance(mutation.addedNodes);
              }
              function wait(ms) {
                return new Promise(resolve => setTimeout(()=>{
                  
                }, ms));
              }
        })
      });
    observer.observe(tBody, {childList: true})
  }

  // DESCOBRE E FILTRA AS DISTANCIAS EXPORTANDO OS POSTOS NO FILTRO
  const getDistance = async (array)=>{
    let postosDeSaida = [];
    let postosDeMeioCaminho = [];
    let postosDeChegada = [];
      const arrayTr = Array.from(array).map(tr => {
        const lastTd = tr.querySelector("td:last-child");
        const split_lastTd = lastTd.innerHTML.split("<br>");
        const distance = parseFloat(split_lastTd[0].replace(/\D/g, ',').replace(/,+/g, ',').replace(/^,|,$/g, '').replace(/,/g, '.'));
        if(distance - 0 < 50){
          postosDeSaida.push(tr);
        }else if(distance - 0 > 300 && distance - 0 < 1000){
          postosDeMeioCaminho.push(tr);
        }else if(distance - 0 > 1000 && distance - 0 < 2000){
          postosDeChegada.push(tr);
        }
      })  
    getPrices(postosDeSaida, postosDeMeioCaminho, postosDeChegada);
    }

    // DESCOBRE OS POSTOS MAIS BARATOS
    const getPrices = (postosDeSaida, postosDeMeioCaminho, postosDeChegada) => {
      let values = [];
      let combValue = 620;
      postosDeSaida.map(posto => {
        const combustivel = parseFloat(posto.querySelector(".combustivel").innerText.replace(/\D/g, '').slice(2));
        if(combustivel < combValue && combustivel > 530){
          combValue = combustivel;
          values.push(posto.innerHTML);
        }
      })
      combValue = 620;
      postosDeMeioCaminho.map(posto => {
        const combustivel = parseFloat(posto.querySelector(".combustivel").innerText.replace(/\D/g, '').slice(2));
        if(combustivel < combValue && combustivel > 530){
          combValue = combustivel;
          values.push(posto.innerHTML);
        }
      })
      combValue = 620;
      postosDeChegada.map(posto => {
        const combustivel = parseFloat(posto.querySelector(".combustivel").innerText.replace(/\D/g, '').slice(2));
        if(combustivel < combValue && combustivel > 530){
          combValue = combustivel;
          values.push(posto.innerHTML);
        }
      })
      chrome.runtime.sendMessage({ values });
    }

    getTr();
  // const lists_from_options = Array.from(options).map(li => {
  //   console.log(li);
  // })
}
