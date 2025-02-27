let Nährwerte, Rezepte,Einheiten,Zutaten //Sind Matrizen die alle informationen der DB enthalten
let cheatmeals_Liste = [], kalorienarmeRezepte = [], proteinreicheRezepte = [], vegetarische_Rezepte = [], vegane_Rezepte = [], Fleisch_Rezepte = [] // Sind Listen in den die Rezept_ID der jeweiligen Rezepte gespeichert werden, in welche Kategorie sie eben gerade passen
let number_of_recipes = 8
let number_of_recipe_blocks = Math.round(number_of_recipes / 2)
let links_open_recipe = document.querySelectorAll(".link-open-recipe")

links_open_recipe.forEach(function (link) {
    link.addEventListener("click", open_recipe)
})


function open_recipe() {
    window.location.href="rezept"
}

function daten_aus_db() {
    fetch('cgi-bin/db_connection.php')
        .then(response => response.json())
        .then(daten => {
            //Daten aus der PHP Datei in die Matrizen einfügen, damit man in JS damit arbeiten kann
            Rezepte = daten.rezepte
            Nährwerte = daten.naehrwerte
            Zutaten = daten.zutaten
            Einheiten = daten.einheiten
            sessionStorage.setItem("Rezepte", JSON.stringify(Rezepte))
            sessionStorage.setItem("Nährwerte", JSON.stringify(Nährwerte))
            sessionStorage.setItem("Zutaten", JSON.stringify(Zutaten))
            sessionStorage.setItem("Einheiten", JSON.stringify(Einheiten))

            console.log("daten geladen")
            einkategorisieren()

        })
        .catch(error => { //Falls irgendwo nen Fehler auftritt, sieht man gleich über den error warum
            console.error("Fehler beim Abrufen der Daten:", error)
        })
}

function einkategorisieren (){
    // hier wird jeweils ein Objekt (eine Reihe von einem Rezept mit bestimmter ID überprüft, ob sie bestimmte Voraussetzungen hat. Wenn ja, wird sie mit der Rezept_ID hinzugefügt. Falls nein passiert nichts. (alles nur im Hintergrund)
    for ( let i = 0; i < Nährwerte.length; i++) {
        let Rezept_überprüfung = Nährwerte[i]
        if (Rezept_überprüfung.Kalorien >= 800) {               //Hier kann man einstellen, ab wann es eben zu den cheatmeals gehört
            cheatmeals_Liste.push(Rezept_überprüfung.Rezept_ID)
        }
        if(Rezept_überprüfung.Kalorien <= 300) {                //Hier kann man einstellen, ab wann es eben zu den Kalorienarmen gehört
            kalorienarmeRezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Protein >= 40){                   //Hier kann man einstellen, ab wann es eben zu den Eiweiß reichen Rezepten gehört
            proteinreicheRezepte.push(Rezept_überprüfung.Rezept_ID)
        }
    }
    for (let i = 0; i < Rezepte.length; i++){
        let Rezept_überprüfung = Rezepte[i]
        if (Rezept_überprüfung.Essgewohnheit === "vegetarisch"){
            vegetarische_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit === "vegan"){
            vegane_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit === "mit Fleisch"){
            Fleisch_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
    }
    sessionStorage.setItem("cheatmeals_Liste", JSON.stringify(cheatmeals_Liste))
    sessionStorage.setItem("kalorienarmeRezepte", JSON.stringify(kalorienarmeRezepte))
    sessionStorage.setItem("proteinreicheRezepte", JSON.stringify(proteinreicheRezepte))
    sessionStorage.setItem("vegetarische_Rezepte", JSON.stringify(vegetarische_Rezepte))
    sessionStorage.setItem("vegane_Rezepte", JSON.stringify(vegane_Rezepte))
    sessionStorage.setItem("Fleisch_Rezepte", JSON.stringify(Fleisch_Rezepte))

    finished_db()
}

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

// Rezepte erste einfügen, wenn Datenbank komplett fertig abgerufen und einkategorisiert wurde
function finished_db() {
    insert_recipes_blocks()
    insert_recipe_card_information()
}

daten_aus_db()


// TODO: wenn die divs link-open-recipe die class link haben, ist die Anordnung gut, sonst nicht, aber ich finde kein CSS, dass das macht

// TODO: ganz am Ende internal_path.php aus strato entfernen