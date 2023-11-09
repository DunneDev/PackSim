document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const packComposition = {
        common: 4,
        uncommon: 3,
        rare: 1,
    };

    const set = "arn";

    fetch(`https://api.scryfall.com/cards/search?q=set:${set}`)
        .then((response) => response.json())
        .then((data) => {
            const setData = data.data;

            const cards = {
                common: filterByRarity("common", setData),
                uncommon: filterByRarity("uncommon", setData),
                rare: filterByRarity("rare", setData),
            };

            const packAmount = document.querySelector("#amount").value;

            const cardCount = {};

            for (const rarity in packComposition) {
                for (let i = 0; i < packComposition[rarity] * packAmount; i++) {
                    const card =
                        cards[rarity][
                            Math.floor(Math.random() * cards[rarity].length)
                        ];
                    const cardName = card.name;
                    if (cardCount[cardName]) {
                        cardCount[cardName]++;
                    } else {
                        cardCount[cardName] = 1;
                    }
                }
            }

            const textArea = document.querySelector("#results");
            textArea.textContent = "";
            for (const card in cardCount) {
                textArea.textContent += `${cardCount[card]} ${card}\n`;
            }

            textArea.textContent = textArea.textContent.slice(0, -1);

            const resultsModal = new bootstrap.Modal("#resultsModal", {
                keyboard: false,
            });
            resultsModal.show();
        })
        .catch((error) => console.error(error));
});

document.querySelector("#copy").addEventListener("click", function () {
    const copyText = document.getElementById("results");

    navigator.clipboard
        .writeText(copyText.textContent)
        .then(() => copyText.select());
});

function filterByRarity(rarity, setData) {
    return setData.filter((card) => card.rarity === rarity);
}
