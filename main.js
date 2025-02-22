let number_of_recipes = 6
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
    for (let i = 0; i < window.Rezepte.length; i++) { //hier werden alle Rezept_Ids erstmal in eine vollständige Liste eingefügt
        Rezepte_IDs.push(window.Rezepte[i].Rezept_ID)
    }
    for(let i = 0; i < number_of_recipes; i++){ //hier wird die schleife so oft durchlaufen, wie Karten erstellt wurden
        let j = Math.floor(Math.random() * Rezepte_IDs.length) //hier wird zufällige Zahl generiert die von 0 bis länge der Rezept_Ids Liste gibt
        Zufalls_Rezept_IDs.push(Rezepte_IDs[j]) //hier in endgültige Liste eingefügt
        Rezepte_IDs.splice(j,1) //damit nichts doppelt hier Element entfernt
    }
    // console.log(Zufalls_Rezept_IDs)
    // console.log(window.Rezepte)
    return Zufalls_Rezept_IDs
}

// Rezepte in die recipe-cards einfügen
function insert_recipe_card_information() {
    let list_IDs = Rezepte_auswählen()
    let recipe_cards = Array.from(document.querySelectorAll(".recipe-card"))
    for (let i = 0; i < number_of_recipes; i++) {
        let recipe_name = recipe_cards[i].querySelector(".label-text")
        let image = recipe_cards[i].querySelector(".image")

        recipe_name.textContent = window.Rezepte[list_IDs[i] - 1].Rezeptname // 1. Zeile (Index 0) von window.Rezepte hat die Rezepte-ID 1 --> der Index in window.Rezepte ist also immer eins tiefer als dessen Rezepte-ID
        // console.log("Rezeptename: " + recipe_name.textContent)
        image.src = `img/recipes/${list_IDs[i]}/${window.Rezepte[list_IDs[i] - 1].Bilder}` // hier anpassen, wenn wir mehrere Bilder in Rezepte.Bilder rein machen
        // console.log("Bildquelle: " + image.srcText)
    }
}

setTimeout(function() {
    insert_recipes_blocks()
    insert_recipe_card_information()
}, 1200)
//TODO: Anpassen/ Schönere Methode finden, damit die Funktion nicht nach einem Timeout, sondern direkt nachdem globals.js durchgelaufen ist, ausgeführt wird
