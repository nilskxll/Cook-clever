let Rezepte = JSON.parse(sessionStorage.getItem("Rezepte"))
let Nährwerte = JSON.parse(sessionStorage.getItem("Nährwerte"))
let Zutaten = JSON.parse(sessionStorage.getItem("Zutaten"))
let Einheiten = JSON.parse(sessionStorage.getItem("Einheiten"))
let cheatmeals_Liste = JSON.parse(sessionStorage.getItem("cheatmeals_Liste"))
let kalorienarmeRezepte = JSON.parse(sessionStorage.getItem("kalorienarmeRezepte"))
let proteinreicheRezepte = JSON.parse(sessionStorage.getItem("proteinreicheRezepte"))
let vegetarische_Rezepte = JSON.parse(sessionStorage.getItem("vegetarische_Rezepte"))
let vegane_Rezepte = JSON.parse(sessionStorage.getItem("vegane_Rezepte"))
let Fleisch_Rezepte = JSON.parse(sessionStorage.getItem("Fleisch_Rezepte"))

let valid_IDs = JSON.parse(sessionStorage.getItem("valid_IDs"))
// console.log("übergebene IDs: " + valid_IDs)

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

        recipe_name.textContent = Rezepte[list_IDs[i] - 1].Rezeptname // 1. Zeile (Index 0) von Rezepte hat die Rezepte-ID 1 --> der Index in Rezepte ist also immer eins tiefer als dessen Rezepte-ID
        // console.log("Rezeptename: " + recipe_name.textContent)
        image.src = `../img/recipes/${list_IDs[i]}/${Rezepte[list_IDs[i] - 1].Bilder}` // hier anpassen, wenn wir mehrere Bilder in Rezepte.Bilder rein machen
        // console.log("Bildquelle: " + image.srcText)
    }
}

// Event-Listeners auf die Link-Buttons hinzufügen, um Rezepte öffnen zu können
function add_recipe_link_event_listeners() {
    let links_open_recipe = document.querySelectorAll(".block-recipes .link-open-recipe")
    links_open_recipe.forEach(function (link) {
        link.addEventListener("click", function() {
            // angeklicktes Rezept öffnen
            let parent = this.closest(".recipe-card")
            let recipe_name = parent.querySelector(".heading .label-text").textContent
            if (recipe_name) {
                window.location.href=`../rezept/#/${encodeURIComponent(recipe_name)}`
            } else {
                console.error("Keinen Rezeptnamen gefunden, um die Rezeptseite zu öffnen!")
            }

        })
    })
}


insert_recipes_blocks()
insert_recipe_card_information()
add_recipe_link_event_listeners()

// TODO: anzeigen, nach was gesucht wurde
// TODO: wird nichts gefunden, das dem Nutzer mitteilen
// TODO: evtl die erste recipe-row aus der Startseite importieren (dass Änderungen auf der Startseite direkt übernommen werden)