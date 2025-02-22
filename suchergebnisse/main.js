let valid_IDs = sessionStorage.getItem("valid_IDs").split(",")
console.log("übergebene IDs: " + valid_IDs)

let number_of_recipes = valid_IDs.length
let number_of_recipe_blocks = Math.round(number_of_recipes / 2)

// Rezepte-Rows (nach gewünschter Anzahl) erstellen
function insert_recipes_blocks() {
    // Rezepte-Rows einfügen (2 Rezepte-Karten pro Row)
    let recipes_block = document.querySelector(".block-recipes")
    let recipes_row = document.querySelector(".recipes-row")
    for (let i = 0; i < number_of_recipe_blocks - 1; i++) {
        let clone = recipes_row.cloneNode(true)
        recipes_block.appendChild(clone)
    }
    // letzte Rezepte-Karte entfernen, wenn ungerade Anzahl Rezepte gewünscht ist
    if (number_of_recipes % 2 === 1) {
        let recipe_cards_list = Array.from(document.querySelectorAll(".recipe-card"))
        let last_recipe_card = recipe_cards_list[recipe_cards_list.length - 1]
        last_recipe_card.style.display = "none"
    }
}

// Rezepte in die recipe-cards einfügen
function insert_recipe_card_information() {
    let list_IDs = valid_IDs
    console.log("test")
    let recipe_cards = Array.from(document.querySelectorAll(".recipe-card"))
    for (let i = 0; i < number_of_recipes; i++) {
        let recipe_name = recipe_cards[i].querySelector(".label-text")
        let image = recipe_cards[i].querySelector(".image")

        recipe_name.textContent = window.Rezepte[list_IDs[i] - 1].Rezeptname // 1. Zeile (Index 0) von window.Rezepte hat die Rezepte-ID 1 --> der Index in window.Rezepte ist also immer eins tiefer als dessen Rezepte-ID
        console.log("Rezeptename: " + recipe_name.textContent)
        image.src = `../img/recipes/${list_IDs[i]}/${window.Rezepte[list_IDs[i] - 1].Bilder}` // hier anpassen, wenn wir mehrere Bilder in Rezepte.Bilder rein machen
        console.log("Bildquelle: " + image.srcText)
    }
}

setTimeout(function() {
    insert_recipes_blocks()
    insert_recipe_card_information()
}, 1200)
// TODO: Anpassen/ Schönere Methode finden, damit die Funktion nicht nach einem Timeout, sondern direkt nachdem globals.js durchgelaufen ist, ausgeführt wird
// TODO: wird nichts gefunden, das dem Nutzer mitteilen