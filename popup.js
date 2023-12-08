document.getElementById('getHTML').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      function: getTableValues,
    });
  });
  document.querySelector(".content").style.display = "block";
  document.querySelector(".main-content").style.display = "none";
  document.querySelector(".h1").style.display = "block";
});

function getTableValues() {
  const tableElement = document.querySelector('#tabelaPostos'); // Substitua 'your-class-name' pelo nome da sua classe
  if (tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  let currentDistance = 0;
  let variantDistance = 0;
  let initialDistance = 0;
  let currentCombValue = 10630;
  let contComb = 10620;
  let values = [];
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    const rowValues = Array.from(cells).map((cell) => {
      let last_td = row.querySelector("td:last-child");
      let distance = last_td.innerHTML.split("<br>");
      let number = distance[0].replace(/\D/g, ',').replace(/,+/g, ',').replace(/^,|,$/g, '').replace(/,/g, '.');
      let currentNumber = parseFloat(number);
      if (currentNumber - currentDistance >= 500 && currentNumber - currentDistance <= 850) {
        const current_td = row.querySelector(".combustivel");
        if(current_td.innerText === "Nenhum preço encontrado."){
          return;
        }
        else if(parseFloat(current_td.innerText.replace(/\D/g, '')) < currentCombValue){
          currentDistance = currentNumber;
          values.push(row.innerHTML);
        }
      }
      if(currentNumber - variantDistance >= 400 && currentNumber - variantDistance <= 500){
        const current_td = row.querySelector(".combustivel");
        if(current_td.innerText === "Nenhum preço encontrado."){
          return;
        }else if(parseFloat(current_td.innerText.replace(/\D/g, '')) < currentCombValue){
          variantDistance = currentNumber;  
          values.push(row.innerHTML);
        }
      }
      if(currentNumber - initialDistance <= 100){
        const current_td = row.querySelector(".combustivel");
        if(current_td.innerText === "Nenhum preço encontrado."){
          return;
        }else if(parseFloat(current_td.innerText.replace(/\D/g, '')) < currentCombValue && parseFloat(current_td.innerText.replace(/\D/g, '')) > 10540){
          initialDistance = currentNumber;
          let postos = [];
          postos.push(row); 
          postos.map((posto) => {
            if(posto.querySelector(".combustivel").innerText.replace(/\D/g, '') < contComb){
              contComb = posto.querySelector(".combustivel").innerText.replace(/\D/g, '');
              values.push(row.innerHTML);
            }
          })
        }
      }
    });
  });
  chrome.runtime.sendMessage({ values });

  } else {
    console.error('Table not found');
  }
}
