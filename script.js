document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const packComp = {
        c: 11,
        u: 3,
        r: 1,
    };

    const set = "2ED";

    const amount = document.querySelector("#amount").value;

    const cardCount = {};

    const promises = [];

    for (const rarity in packComp) {
        for (let i = 0; i < packComp[rarity] * amount; i++) {
            console.log(
                `Fetching ${rarity} card ${i + 1} of ${
                    packComp[rarity] * amount
                }`
            );
            const promise = fetch(
                `https://api.scryfall.com/cards/random?q=set:${set}+rarity:${rarity}`
            )
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data);
                    const cardName = data.name;
                    if (cardCount[cardName]) {
                        cardCount[cardName]++;
                    } else {
                        cardCount[cardName] = 1;
                    }
                })
                .catch((error) => console.error(error));
            promises.push(promise);
        }
    }

    Promise.all(promises).then(() => {
        console.log(cardCount);
        const textArea = document.querySelector("#results");
        for (const card in cardCount) {
            textArea.textContent += `${cardCount[card]} ${card}\n`;
        }

        const resultsModal = new bootstrap.Modal("#resultsModal", {
            keyboard: false,
        });
        resultsModal.show();
    });
});
