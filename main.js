let number_of_recipes = 8
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

// zufällige Rezepte IDs auswählen (für die Vorschläge)
function Rezepte_auswählen (){
    let Rezepte_IDs = []
    let Zufalls_Rezept_IDs = [] //endgültige Liste, in der am ende alle zufällig ausgewählten rezepte drin sind
    for (let i = 0; i < Rezepte.length; i++) { //hier werden alle Rezept_Ids erstmal in eine vollständige Liste eingefügt
        Rezepte_IDs.push(Rezepte[i].Rezept_ID)
    }
    for(let i = 0; i < number_of_recipes; i++){ //hier wird die schleife so oft durchlaufen, wie Karten erstellt wurden
        let j = Math.floor(Math.random() * Rezepte_IDs.length) //hier wird zufällige Zahl generiert die von 0 bis länge der Rezept_Ids Liste gibt
        Zufalls_Rezept_IDs.push(Rezepte_IDs[j]) //hier in endgültige Liste eingefügt
        Rezepte_IDs.splice(j,1) //damit nichts doppelt hier Element entfernt
    }
    // console.log(Zufalls_Rezept_IDs)
    // console.log(Rezepte)
    return Zufalls_Rezept_IDs
}

// Rezepte in die recipe-cards einfügen
function insert_recipe_card_information() {
    let list_IDs = Rezepte_auswählen()
    let recipe_cards = Array.from(document.querySelectorAll(".recipe-card"))
    for (let i = 0; i < number_of_recipes; i++) {
        let recipe_name = recipe_cards[i].querySelector(".label-text")
        let image = recipe_cards[i].querySelector(".image")

        recipe_name.textContent = Rezepte[list_IDs[i] - 1].Rezeptname // 1. Zeile (Index 0) von Rezepte hat die Rezepte-ID 1 --> der Index in Rezepte ist also immer eins tiefer als dessen Rezepte-ID
        // console.log("Rezeptename: " + recipe_name.textContent)
        image.src = `img/recipes/${list_IDs[i]}/${Rezepte[list_IDs[i] - 1].Bilder}` // hier anpassen, wenn wir mehrere Bilder in Rezepte.Bilder rein machen
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
                window.location.href=`rezept/#/${encodeURIComponent(recipe_name)}`
            } else {
                console.error("Keinen Rezeptnamen gefunden, um die Rezeptseite zu öffnen!")
            }
        })
    })
}

// Rezepte erste einfügen, wenn Datenbank komplett fertig abgerufen und einkategorisiert wurde
function finished_db() {
    insert_recipes_blocks()
    insert_recipe_card_information()
    add_recipe_link_event_listeners()
}

set_db_variables()

// TODO: ganz am Ende internal_path.php aus strato entfernen