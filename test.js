const cells = row.querySelectorAll('td');
const rowValues = Array.from(cells).map((cell) => {
    let last_td = row.querySelector("td:last-child");
    let distance = last_td.innerHTML.split("<br>");
    let number = distance[0].replace(/\D/g, ',').replace(/,+/g, ',').replace(/^,|,$/g, '').replace(/,/g, '.');
    let currentNumber = parseFloat(number);

    if (currentNumber - currentDistance >= 500) {
        // Encontrar a TR com o valor igual a "number"
        const targetRow = Array.from(document.querySelectorAll('tr')).find((tr) => {
            const tdValue = tr.querySelector('td:last-child').innerHTML;
            return parseFloat(tdValue.replace(/\D/g, ',')) === currentNumber;
        });

        if (targetRow) {
            // Pegar o valor do combustível da TR encontrada
            const combustivelValue = parseFloat(targetRow.querySelector('.combustivel').innerHTML.replace(/\D/g, ','));

            // Encontrar todas as linhas próximas
            const nearbyRows = Array.from(document.querySelectorAll('tr')).filter((tr) => {
                const tdValue = parseFloat(tr.querySelector('td:last-child').innerHTML.replace(/\D/g, ','));
                return Math.abs(tdValue - currentNumber) < 500;
            });

            // Encontrar o valor mais barato entre as distâncias próximas
            let menorCombustivel = combustivelValue;
            for (const nearbyRow of nearbyRows) {
                const nearbyCombustivel = parseFloat(nearbyRow.querySelector('.combustivel').innerHTML.replace(/\D/g, ','));
                if (nearbyCombustivel < menorCombustivel) {
                    menorCombustivel = nearbyCombustivel;
                }
            }

            console.log('Menor valor de combustível entre distâncias próximas:', menorCombustivel);
        }
    }
});
