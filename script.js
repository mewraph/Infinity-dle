let characters = [];
let mysteryCharacter = null;
let guessedCharacters = [];
let gameWon = false;
let gamesPlayed = Number(localStorage.getItem("onePieceDleGamesPlayed")) || 0;
let totalGuesses = Number(localStorage.getItem("onePieceDleTotalGuesses")) || 0;

function updateStats() {

    document.getElementById("games-played").textContent = gamesPlayed;

    const average =
        gamesPlayed > 0
            ? (totalGuesses / gamesPlayed).toFixed(1)
            : "0";

    document.getElementById("average-guesses").textContent = average;
}


fetch("characters.json")
    .then(response => response.json())
    .then(data => {
        // ...
    });

// ========================================
// CHARGEMENT DES PERSONNAGES
// ========================================

fetch("characters.json")
    .then(response => response.json())
    .then(data => {

    characters = data;

    // Choisir un personnage mystère au hasard
    mysteryCharacter =
        characters[Math.floor(Math.random() * characters.length)];

        updateStats();
        
    console.log("Personnages chargés :", characters);

    console.log("Personnage mystère :", mysteryCharacter);

})
    .catch(error => {

        console.error(
            "Erreur lors du chargement des personnages :",
            error
        );

    });


// ========================================
// RECHERCHE DES PERSONNAGES
// ========================================

const searchInput = document.getElementById("character-search");
const searchResults = document.getElementById("search-results");

function selectCharacter(character) {

    searchInput.value = "";

    searchResults.innerHTML = "";

    guessedCharacters.push(character.name);


    // Comparer le personnage
    const comparison = compareCharacter(character);


    // Afficher la proposition
    displayGuess(character, comparison);

    updateHints();


    console.log("Personnage sélectionné :", character);

    console.log("Résultat :", comparison);


    // Vérifier si le personnage est le bon
    if (character.name === mysteryCharacter.name) {

    gameWon = true;

    // Enregistrer la partie
    gamesPlayed++;
    totalGuesses += guessedCharacters.length;

    localStorage.setItem(
        "onePieceDleGamesPlayed",
        gamesPlayed
    );

    localStorage.setItem(
        "onePieceDleTotalGuesses",
        totalGuesses
    );

    updateStats();

    displayWinMessage();
    searchInput.disabled = true;
}

}

searchInput.addEventListener("input", function () {

    if (gameWon) {
        return;
    }

    const searchText = searchInput.value.toLowerCase().trim();


    // On vide les résultats
    searchResults.innerHTML = "";


    // Si la recherche est vide, on ne montre rien
    if (searchText === "") {
        return;
    }


    // Recherche des personnages
    const results = characters.filter(character => {

    const nameParts = character.name
        .toLowerCase()
        .split(" ");

    const matchesSearch = nameParts.some(part =>
        part.startsWith(searchText)
    );

    return matchesSearch &&
        !guessedCharacters.includes(character.name);

});


    // Affichage des résultats
    results.forEach(character => {

    const result = document.createElement("div");
result.classList.add("search-result");

// Image
const image = document.createElement("img");
image.src = character.image;
image.alt = character.name;
image.classList.add("search-result-image");

// Nom
const name = document.createElement("span");
name.textContent = character.name;

result.appendChild(image);
result.appendChild(name);



    // Quand on clique sur un personnage
    result.addEventListener("click", function () {

        selectCharacter(character);

    });


    searchResults.appendChild(result);

});

});

searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        if (searchResults.firstChild) {

            const characterName =
                searchResults.firstChild.textContent;

            const character =
                characters.find(
                    character => character.name === characterName
                );

            if (character) {

                selectCharacter(character);

            }

        }

    }

});

// ========================================
// ORDRE DES ARCS
// ========================================

const arcOrder = [
    "Romance Dawn",
    "Orange Town",
    "Sirop",
    "Baratie",
    "Arlong Park",
    "LogueTown",
    "Reverse Mountain",
    "Whisky Peak",
    "Little Garden",
    "Drum",
    "Alabasta",
    "Jaya",
    "Skypiea",
    "Long Ring Long Land",
    "Water Seven",
    "Enies Lobby",
    "Thriller Bark",
    "Sabaody",
    "Amazon Lily",
    "Impel Down",
    "Marine Ford",
    "Post Marine Ford",
    "Retour à Sabaody",
    "Ile des Hommes-poissons",
    "Punk Hazard",
    "Dressrosa",
    "Zou",
    "Whole Cake",
    "Rêverie",
    "Wano",
    "Egg Head",
    "Erbaf"
];
function compareCharacter(character) {

    const results = {};

    // Genre
    results.gender =
        character.gender === mysteryCharacter.gender
            ? "🟩"
            : "🟥";


    // Affiliation
    results.affiliation =
        character.affiliation === mysteryCharacter.affiliation
            ? "🟩"
            : "🟥";


    // Type de fruit
    results.fruitType =
        character.fruitType === mysteryCharacter.fruitType
            ? "🟩"
            : "🟥";


    // Origine
    results.origin =
        character.origin === mysteryCharacter.origin
            ? "🟩"
            : "🟥";


// Prime
if (
    character.bounty === null &&
    mysteryCharacter.bounty === null
) {

    // Les deux primes sont inconnues
    results.bounty = "🟩";

} else if (
    character.bounty === null ||
    mysteryCharacter.bounty === null
) {

    // Une seule des deux primes est inconnue
    results.bounty = "🟥";

} else if (
    character.bounty === mysteryCharacter.bounty
) {

    // Les deux primes sont connues et identiques
    results.bounty = "🟩";

} else if (
    character.bounty < mysteryCharacter.bounty
) {

    // La prime proposée est trop basse
    results.bounty = "⬆️";

} else {

    // La prime proposée est trop élevée
    results.bounty = "⬇️";

}

    // Premier arc
    const characterArcIndex =
    arcOrder.indexOf(character.firstArc);

    const mysteryArcIndex =
    arcOrder.indexOf(mysteryCharacter.firstArc);


    if (characterArcIndex === mysteryArcIndex) {

    results.firstArc = "🟩";

    } else if (characterArcIndex < mysteryArcIndex) {

    results.firstArc = "⬆️";

    } else {

    results.firstArc = "⬇️";

    }


    // Haki
    const commonHaki = character.haki.filter(
        haki => mysteryCharacter.haki.includes(haki)
    );

    if (
        commonHaki.length === mysteryCharacter.haki.length &&
        commonHaki.length === character.haki.length
    ) {

        results.haki = "🟩";

    } else if (commonHaki.length > 0) {

        results.haki = "🟧";

    } else {

        results.haki = "🟥";

    }


    return results;
}

// ========================================
// AFFICHER UNE PROPOSITION
// ========================================

function displayGuess(character, results) {

    const guessesContainer =
        document.getElementById("guesses-container");


    // Supprimer le message "Aucune proposition"
    const emptyMessage =
        guessesContainer.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }


    // Créer la ligne
    const guess = document.createElement("div");

    guess.classList.add("guess");


// ========================================
// CARTE PERSONNAGE
// ========================================

const name = document.createElement("div");

name.classList.add("guess-name");


// Image du personnage
const image = document.createElement("img");

image.src = character.image;

image.alt = character.name;

image.classList.add("guess-image");


// Nom du personnage
const nameText = document.createElement("span");

nameText.textContent = character.name;

nameText.classList.add("guess-name-text");


// Ajouter l'image et le nom dans la carte
name.appendChild(image);

name.appendChild(nameText);


// Ajouter la carte à la ligne
guess.appendChild(name);


    // Genre
    guess.appendChild(
        createResultBox(
            "Genre",
            character.gender,
            results.gender
        )
    );


    // Affiliation
    guess.appendChild(
        createResultBox(
            "Affiliation",
            character.affiliation,
            results.affiliation
        )
    );


    // Type de fruit
    guess.appendChild(
        createResultBox(
            "Fruit",
            character.fruitType,
            results.fruitType
        )
    );


    // Haki
    guess.appendChild(
        createResultBox(
            "Haki",
            character.haki.length > 0
                ? character.haki.join(" / ")
                : "Aucun",
            results.haki
        )
    );


    // Prime
    guess.appendChild(
        createResultBox(
            "Prime",
            formatBounty(character.bounty),
            results.bounty
        )
    );


    // Origine
    guess.appendChild(
        createResultBox(
            "Origine",
            character.origin,
            results.origin
        )
    );


    // Première apparition
    guess.appendChild(
        createResultBox(
            "Premier arc",
            character.firstArc,
            results.firstArc
        )
    );


    // Ajouter la proposition à la page
    guessesContainer.prepend(guess);
}

function updateHints() {

    const hintsContainer =
        document.getElementById("hints-container");

    hintsContainer.innerHTML = "";

    // Indice 1 : après 6 essais
    if (guessedCharacters.length >= 6) {

        const hint = document.createElement("div");
        hint.classList.add("hint");

        hint.innerHTML = `
            <div class="hint-title">💡 INDICE 1 — PREMIER ARC</div>
            <div class="hint-value">${mysteryCharacter.firstArc}</div>
        `;

        hintsContainer.appendChild(hint);
    }

    // Indice 2 : après 9 essais
    if (guessedCharacters.length >= 9) {

        const hint = document.createElement("div");
        hint.classList.add("hint");

        hint.innerHTML = `
            <div class="hint-title">💡 INDICE 2 — TYPE DE FRUIT</div>
            <div class="hint-value">${mysteryCharacter.fruitType}</div>
        `;

        hintsContainer.appendChild(hint);
    }
}

function createResultBox(label, value, result) {

    const box = document.createElement("div");

    box.classList.add("result-box");


    // Ajouter la couleur selon le résultat
    if (result === "🟩") {
    box.classList.add("green");
    }

    else if (result === "🟧") {
    box.classList.add("orange");
    }

    else if (
    result === "🟥" ||
    result === "⬆️" ||
    result === "⬇️"
    ) {
    box.classList.add("red");
    }


    const labelElement = document.createElement("span");

    labelElement.classList.add("result-label");

    labelElement.textContent = label;


    const valueElement = document.createElement("span");

    valueElement.classList.add("result-value");

    valueElement.textContent = value;


    const resultElement = document.createElement("span");

    resultElement.classList.add("result-icon");

    if (result === "🟩") {
    resultElement.textContent = "✓";
}
else if (result === "🟥") {
    resultElement.textContent = "✕";
}
else {
    resultElement.textContent = result;
}


    box.appendChild(labelElement);

    box.appendChild(valueElement);

    box.appendChild(resultElement);


    return box;
}
function formatBounty(bounty) {

    if (bounty === null) {
        return "Inconnue";
    }

    return bounty.toLocaleString("fr-FR") + " ฿";

}

// ========================================
// MESSAGE DE VICTOIRE
// ========================================

function displayWinMessage() {

    const winMessageContainer =
        document.getElementById("win-message-container");

    const message = document.createElement("div");
    message.classList.add("win-message");

    const attempts = guessedCharacters.length;

    message.innerHTML = `
        <div class="victory-title">
            🎉 <strong>Félicitations !</strong>
        </div>

        <img
            src="${mysteryCharacter.image}"
            alt="${mysteryCharacter.name}"
            class="victory-image"
        >

        <div>
            Tu as trouvé <strong>${mysteryCharacter.name}</strong> !
        </div>

        <span class="attempts">
            Nombre d'essais : <strong>${attempts}</strong>
        </span>

        <br>

        <button class="replay-button" onclick="restartGame()">
            ↻ REJOUER
        </button>
    `;

    winMessageContainer.appendChild(message);

    launchConfetti();
}
function launchConfetti() {

    const colors = [
        "#ef4444",
        "#facc15",
        "#22c55e",
        "#3b82f6",
        "#a855f7",
        "#f97316"
    ];

    for (let i = 0; i < 80; i++) {

        const confetti = document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left =
            Math.random() * 100 + "vw";

        confetti.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.animationDuration =
            (Math.random() * 2 + 2) + "s";

        confetti.style.animationDelay =
            Math.random() * 0.5 + "s";

        confetti.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4500);
    }
}
// ========================================
// REJOUER
// ========================================

function restartGame() {

    // Garder l'ancien personnage
    const oldMysteryCharacter = mysteryCharacter;


    // Choisir un nouveau personnage
    do {

        mysteryCharacter =
            characters[Math.floor(Math.random() * characters.length)];

    } while (
        mysteryCharacter.name === oldMysteryCharacter.name
    );


    // Réinitialiser les propositions
    guessedCharacters = [];


    // Réinitialiser l'état de la partie
    gameWon = false;


    // Réactiver la recherche
    searchInput.disabled = false;


    // Vider la recherche
    searchInput.value = "";


    // Vider les résultats de recherche
    searchResults.innerHTML = "";


    // Supprimer le message de victoire
    const winMessageContainer =
        document.getElementById("win-message-container");

    winMessageContainer.innerHTML = "";

    document.getElementById("hints-container").innerHTML = "";


    // Vider les anciennes propositions
    const guessesContainer =
        document.getElementById("guesses-container");

    guessesContainer.innerHTML = `
        <p class="empty-message">
            Aucune proposition pour le moment.
        </p>
    `;


    console.log("Nouvelle partie !");
    console.log("Ancien personnage :", oldMysteryCharacter);
    console.log("Nouveau personnage mystère :", mysteryCharacter);

}