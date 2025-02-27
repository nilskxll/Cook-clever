let minus_button = document.getElementById("minus-button")
let plus_button = document.getElementById("plus-button")
let number_of_portions_text = document.querySelector(".number-of-portions-frame .value")
let number_of_ingredients
let aktuell_Liste_Nährwerte = []

minus_button.addEventListener("click", function() {change_number_of_portions("down")})
plus_button.addEventListener("click", function() {change_number_of_portions("up")})

function aktuelles_Rezept_Werte_zuweisen(aktuell) { //ausgewähltes Rezept (mit variable "aktuell" übergeben, wird in die einzelnen Variablen definiert, um diese dann in folgenden Schritten aufrufen zu können
    if (aktuell <= Rezepte.length) { //überprüfen ob Rezept überhaupt vorhanden (eventuell unnötig)
        portionen = 1 // Immer wenn neues Rezept aufgerufen wird, ist es Standardmäßig auf einer Portion
        aktuelle_Nährwerte = window.Nährwerte[aktuell - 1] // Wir bei 1 anfangen und Computer bei 0 deshalb minus 1. Allgemein wird in den Zeilen einfach nur eine Zeile (mit Rezept_ID === aktuell) den jeweiligen Listen zugewiesen
        aktuelles_Rezept = window.Rezepte[aktuell - 1]
        aktuelle_Zutaten = window.Zutaten[aktuell - 1]

        aktuell_Liste_Nährwerte.push(aktuelle_Nährwerte.Kalorien) // in den folgenden Zeilen wird dann aus der eben Definierten Liste, verschiedene Objekte definiert (damit besser abrufbar)
        aktuell_Liste_Nährwerte.push(aktuelle_Nährwerte.Protein)
        aktuell_Liste_Nährwerte.push(aktuelle_Nährwerte.Fett)
        aktuell_Liste_Nährwerte.push(aktuelle_Nährwerte.Kohlenhydrate)
        aktuell_Liste_Nährwerte.push(aktuelle_Nährwerte.zugesetzer_Zucker)
        aktuell_Liste_Nährwerte.push(aktuelle_Nährwerte.Ballaststoffe)


        aktueller_Rezept_Name = aktuelles_Rezept.Rezeptname // gleiche wie bei den Nährwerten auch bei den allgemeinen Informationen zu dem Rezept
        aktuelle_Anleitung = aktuelles_Rezept.Anleitung
        aktuelle_Essgewohnheit = aktuelles_Rezept.Essgewohnheit

        aktuelle_Arbeitszeit = aktuelles_Rezept.Arbeitszeit // gleiche wie bei den Nährwerten und den allgemeinen Informationen zu dem Rezept auch hier bei den Zeiten zu dem Rezept
        aktuelle_Kochzeit = aktuelles_Rezept.Kochzeit
        aktuelle_Gesamtzeit = aktuelle_Arbeitszeit + aktuelle_Kochzeit
    }
}

function zeit_umrechnen(){ //hier wird einfach nur die Zeit, falls sie über 60min ist umgerechnet in h und der rest bleibt in Minuten (wird aber auch mit ausgegeben)
    Arbeitszeit_h = Math.floor(aktuelle_Arbeitszeit / 60)
    Arbeitszeit_min = aktuelle_Arbeitszeit % 60

    Kochzeit_h = Math.floor(aktuelle_Kochzeit / 60)
    Kochzeit_min = aktuelle_Kochzeit % 60

    Gesamtzeit_h = Math.floor( aktuelle_Gesamtzeit / 60)
    Gesamtzeit_min = aktuelle_Gesamtzeit % 60
}


function Werte_Rezept_ausgeben_Zeit(){//die definierten JS Variablen werden einfach in eine Variable in HTML gepackt
    if (Arbeitszeit_h === 0) { //falls halt unter 60min dann ohne Stunden, wenn mehr als 60min dann mit Stunden ausgeben
        document.getElementById("Arbeitszeit").innerText = Arbeitszeit_min + "min"
    } else {
        if (Arbeitszeit_min === 0) {//wenn dann aber genau eine oder 2 Stunden und keine Minuten bleiben übrig soll er die auch nicht mit ausgeben
            document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h"
        } else {
            document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h " + Arbeitszeit_min + "min"
        }
    }
    if (Kochzeit_h === 0) {//falls halt unter 60min dann ohne Stunden, wenn mehr als 60min dann mit Stunden ausgeben
        document.getElementById("Kochzeit").innerText = Kochzeit_min + "min"
    } else {
        if (Kochzeit_min === 0) {//wenn dann aber genau eine oder 2 Stunden und keine Minuten bleiben übrig soll er die auch nicht mit ausgeben
            document.getElementById("Kochzeit").innerText = Kochzeit_h + "h"
        } else {
            document.getElementById("Kochzeit").innerText = Kochzeit_h + "h " + Kochzeit_min + "min"
        }
    }
    if (Gesamtzeit_h === 0) {//falls halt unter 60min dann ohne Stunden, wenn mehr als 60min dann mit Stunden ausgeben
        document.getElementById("Gesamtzeit").innerText = Gesamtzeit_min + "min"
    } else {
        if (Gesamtzeit_min === 0) {//wenn dann aber genau eine oder 2 Stunden und keine Minuten bleiben übrig soll er die auch nicht mit ausgeben
            document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h"
        } else {
            document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h " + Gesamtzeit_min + "min"
        }
    }
}

function portionenRechner(Portionen){
    if(mengenListe.length === 0) { // überprüfen ob die Liste leer ist, falls ja brauch er ja die Funktion nicht ausführen und lässt nochmal die Liste definieren (ist sozusagen eine sicherheit)
        Zutaten_in_Listen_umwandeln()
    }
    mengenListe_plus_portionen = mengenListe.map(menge => menge * Portionen) //hier wird einfach nur die aktuelle mengenListe mal die eingegeben Portionen gerechnet und gespeichert
    Zutaten_ausgeben()
}


// Anzahl der Portionen extrahieren
function extract_number_of_portions() {
    let text = number_of_portions_text.textContent
    let words = text.split(" ")
    return Number(words[0])
}

// Anzahl der Portionen ändern
function change_number_of_portions (direction) {
    let value = extract_number_of_portions()

    // Wert der Portionenzahl ändern (Beschränkung auf max. 99 hat keinen wirklichen Grund. Lässt man mehr zu, müsste der number of portions frame mit wachsen.)
    if (direction === "up") {
        if (value < 99) {
            value++
        }
    } else if (value > 1) {
        value--
    }

    // Wert mit "Portion" in Singular/Plural ausgeben
    if (value === 1) {
        number_of_portions_text.textContent = "1 Portion"
    } else {
        number_of_portions_text.textContent = `${value} Portionen`
    }

    // Zutatenmengen ändern
    insert_ingredients_names_values()
}

// Zutaten-Elemente einfügen
function insert_ingredients() {
    number_of_ingredients = test_list_names.length

    // Zutatenelemente im HTML klonen
    let ingredients_frame = document.querySelector(".ingredients-frame")
    let ingredient = document.querySelector(".ingredient")
    for (let i = 1; i < number_of_ingredients; i++) {
        let clone = ingredient.cloneNode(true)
        ingredients_frame.appendChild(clone)
    }

    // Namen und Werte der Zutaten einfügen
    insert_ingredients_names_values()
}

// Zutaten Namen und Werte einfügen
let test_list_names = ["Basikilum", "Eier", "Mehl"]
let test_list_values = [2, 6, 500]
let test_list_values_unit = ["", "", "g"]
function insert_ingredients_names_values() {
    let ingredients_list = Array.from(document.querySelectorAll(".ingredient"))
    let number_of_portions = extract_number_of_portions()
    for (let k = 0; k < number_of_ingredients; k++) {
        let ingredient_name = ingredients_list[k].querySelector(".name")
        let ingredient_value = ingredients_list[k].querySelector(".value")

        ingredient_name.textContent = test_list_names[k]
        if (test_list_values_unit[k] === "") {
            ingredient_value.textContent = number_of_portions * test_list_values[k]
        } else {
            ingredient_value.textContent = `${number_of_portions * test_list_values[k]} ${test_list_values_unit[k]}`
        }
    }
}

insert_ingredients()
aktuelles_Rezept_Werte_zuweisen(1)

// TODO: share-button funktonierend machen

function Zutaten_in_Listen_umwandeln(){
    zutatenListe.length = 0 //wichtig das die Listen sobald man von einem rezept aufs nächste klickt auch die Listen wieder leer sind
    mengenListe.length = 0
    einheitenListe.length = 0
    for (zutat in aktuelle_Zutaten){ // jede Zutat wird einmal durchgegangen
        let menge = aktuelle_Zutaten[zutat] // die menge ( wie viel von einer Zutat) wird gespeichert in "menge")

        if (menge !== null && zutat !== "Rezept_ID"){ // wenn die menge dann "Null" ist, dann ist diese Zutat nicht in diesem Rezept vorhanden (nur in anderen) und wird herausgefiltert. Natürlich Rezept_ID auch keine Zutat, deshalb auch rausgefiltert.
            zutatenListe.push(zutat) // falls aber alles passt wird es in die Listen hinein gepushed (in richtiger Reihenfolge (Also wie in DB und nicht Alphabetisch (macht für uns keinen Unterschied))
            mengenListe.push(menge) //das gleiche mit der Menge
            let einheit_Objekte = Einheiten.find(Objekt_Zutat => Objekt_Zutat.Zutat === zutat); // da Einheiten eine Liste mit Objekten ist, muss dort die aktuelle zutat in den Objekten gesucht werden (find)
            einheitenListe.push(einheit_Objekte ? einheit_Objekte.Einheit : ""); // Falls keine Einheit gefunden wird, bleibt es leer
        }
    }
}