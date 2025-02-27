let recipe_name = document.getElementById("recipe-name")
let minus_button = document.getElementById("minus-button")
let plus_button = document.getElementById("plus-button")
let number_of_portions_text = document.querySelector(".number-of-portions-frame .value")
let number_of_ingredients
let recipe_id
let aktuell_Liste_Nährwerte = []

let aktuelle_Nährwerte, aktuelle_Zutaten, aktuelles_Rezept // ist das aktuelle Rezept welches ausgewählt ist. Sozusagen dann eine Liste mit eben allen Informationen zu diesem einen konkreten rezept. So zu sagen jedes von denen hat dann eine Zeile der Tabelle aus der Db (da mehrere Tabellen, werden auch mehrere Variablen benötigt
let aktueller_Rezept_Name, aktuelle_Anleitung, aktuelle_Essgewohnheit // werden die grundlegenden Informationen des Rezeptes ausgegeben
let aktuelle_Arbeitszeit, aktuelle_Kochzeit, aktuelle_Gesamtzeit // Wird die Zeit für das aktuell ausgewählte Rezept gespeichert
let Kochzeit_h, Kochzeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let Arbeitszeit_h, Arbeitszeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let Gesamtzeit_h, Gesamtzeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let zutatenListe = [], mengenListe = [], einheitenListe = [] //
let mengenListe_plus_portionen // einfach die Liste, in der die Mengenangaben multipliziert stehen (im Vergleich zu der mengenListe wo nur für eine Person gerechnet ist)



minus_button.addEventListener("click", function() {change_number_of_portions("down")})
plus_button.addEventListener("click", function() {change_number_of_portions("up")})


// Rezept-ID abfragen
function set_recipe_ID() {
    recipe_id = 1
}

// Rezept Werte zuweisen
function aktuelles_Rezept_Werte_zuweisen(aktuell) { //ausgewähltes Rezept (mit variable "aktuell" übergeben, wird in die einzelnen Variablen definiert, um diese dann in folgenden Schritten aufrufen zu können
    if (aktuell <= Rezepte.length) { //überprüfen ob Rezept überhaupt vorhanden (eventuell unnötig)
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

// Zutaten-Listen erstellen
function Zutaten_in_Listen_umwandeln(){
    zutatenListe.length = 0 //wichtig das die Listen sobald man von einem rezept aufs nächste klickt auch die Listen wieder leer sind
    mengenListe.length = 0
    einheitenListe.length = 0
    let zutat // ist wie i in der dann verwendeten for-schleife. So aber verständlicher mit dem Namen
    for (zutat in aktuelle_Zutaten){ // jede Zutat wird einmal durchgegangen
        let menge = aktuelle_Zutaten[zutat] // die menge (wie viel von einer Zutat) wird gespeichert in "menge")

        if (menge !== null && zutat !== "Rezept_ID"){ // wenn die menge dann "Null" ist, dann ist diese Zutat nicht in diesem Rezept vorhanden (nur in anderen) und wird herausgefiltert. Natürlich Rezept_ID auch keine Zutat, deshalb auch rausgefiltert.
            zutatenListe.push(zutat) // falls aber alles passt, wird es in die Listen hinein gepushed (in richtiger Reihenfolge (Also wie in DB und nicht Alphabetisch (macht für uns keinen Unterschied))
            mengenListe.push(menge) //das gleiche mit der Menge
            let einheit_Objekte = Einheiten.find(Objekt_Zutat => Objekt_Zutat.Zutat === zutat); // da Einheiten eine Liste mit Objekten ist, muss dort die aktuelle zutat in den Objekten gesucht werden (find)
            einheitenListe.push(einheit_Objekte ? einheit_Objekte.Einheit : ""); // Falls keine Einheit gefunden wird, bleibt es leer
        }
    }
}

// Zutaten der Portionszahl anpassen
function portionenRechner(Portionen){
    if(mengenListe.length === 0) { // überprüfen ob die Liste leer ist, falls ja brauch er ja die Funktion nicht ausführen und lässt nochmal die Liste definieren (ist sozusagen eine sicherheit)
        Zutaten_in_Listen_umwandeln()
    }
    mengenListe_plus_portionen = mengenListe.map(menge => menge * Portionen) //hier wird einfach nur die aktuelle mengenListe mal die eingegeben Portionen gerechnet und gespeichert
    Zutaten_ausgeben()
}

// Zeit in Minuten und Stunden rechnen
function zeit_umrechnen(){ //hier wird einfach nur die Zeit, falls sie über 60min ist umgerechnet in h und der rest bleibt in Minuten (wird aber auch mit ausgegeben)
    Arbeitszeit_h = Math.floor(aktuelle_Arbeitszeit / 60)
    Arbeitszeit_min = aktuelle_Arbeitszeit % 60

    Kochzeit_h = Math.floor(aktuelle_Kochzeit / 60)
    Kochzeit_min = aktuelle_Kochzeit % 60

    Gesamtzeit_h = Math.floor( aktuelle_Gesamtzeit / 60)
    Gesamtzeit_min = aktuelle_Gesamtzeit % 60
}

// Rezeptname einfügen
function insert_recipe_name() {
    recipe_name.textContent = ""
}

// Nährwerte einfügen
function insert_nutrients() {

}

// Zeiten einfügen
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

// Rezeptdetails einfügen
function insert_recipe() {
    set_recipe_ID()
    aktuelles_Rezept_Werte_zuweisen(recipe_id)
    Zutaten_in_Listen_umwandeln()
    portionenRechner(extract_number_of_portions())
    zeit_umrechnen()
    insert_recipe_name()
    insert_nutrients()
    Werte_Rezept_ausgeben_Zeit()
    insert_ingredients()
}

insert_recipe()

// TODO: share-button funktonierend machen


function Zutaten_ausgeben(){
    let zutatenText = ""
    if (portionen === 1){//entweder die mit einer Portion
        for (i = 0; i < mengenListe.length; i++){ //dabei geht die for-schleife jedes Objekt in der Liste durch
            if (mengenListe[i] === 0){ // Wenn die mengenListe 0 Anzeigt bedeutet das, dass diese Zutat keine Menge besitzt (Salz)
                zutatenText += zutatenListe[i] + "\n"//der \n macht einfach nur, das es in eine Neue Zeile in den String gesetzt wird
            }
            else { //andern Falls gibt es die Menge und Einheit aus und dann die Zutat, Falls keine Einheit wird einfach nur "" angefügt (also wie nichts)
                zutatenText += mengenListe[i] + einheitenListe[i] + " " + zutatenListe[i] + "\n" //der \n macht einfach nur, das es in eine Neue Zeile in den String gesetzt wird
            }
        }
        document.getElementById("Zutaten").innerText = zutatenText
    }
    else { //oder mit beliebiger Anzahl an Portionen, Aber sonst eins zu eins gleich von Funktion, nimmt nur andere Liste als Berechnung
        for (i = 0; i < mengenListe_plus_portionen.length; i++){
            if (mengenListe_plus_portionen[i] === 0){
                zutatenText += zutatenListe[i] + "\n"
            }
            else {
                zutatenText += mengenListe_plus_portionen[i] + einheitenListe[i] + " " + zutatenListe[i] + "\n"
            }
        }
        document.getElementById("Zutaten").innerText = zutatenText;
    }

}
