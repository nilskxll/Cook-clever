let number_of_recipes = 5
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

insert_recipes_blocks()

function Rezepte_auswählen (){//Zufällig
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
    console.log(Zufalls_Rezept_IDs)
    console.log(window.Rezepte)
    return Zufalls_Rezept_IDs
}

setTimeout(Rezepte_auswählen, 1200)
//TODO: Anpassen/ Schönere Methode finden, damit alles flüssiger Läuft (direkt nach dem alles definiert ist (von global))