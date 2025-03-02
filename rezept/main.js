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

let minus_button = document.getElementById("minus-button")
let plus_button = document.getElementById("plus-button")
let number_of_portions_text = document.querySelector(".number-of-portions-frame .value")

minus_button.addEventListener("click", function() {change_number_of_portions("down")})
plus_button.addEventListener("click", function() {change_number_of_portions("up")})

let aktuell_Liste_Nährwerte = []
let aktuelle_Nährwerte, aktuelle_Zutaten, aktuelles_Rezept // ist das aktuelle Rezept welches ausgewählt ist. Sozusagen dann eine Liste mit eben allen Informationen zu diesem einen konkreten rezept. So zu sagen jedes von denen hat dann eine Zeile der Tabelle aus der Db (da mehrere Tabellen, werden auch mehrere Variablen benötigt
let aktueller_Rezept_Name, aktuelle_Anleitung, aktuelle_Essgewohnheit // werden die grundlegenden Informationen des Rezeptes ausgegeben
let aktuelle_Arbeitszeit, aktuelle_Kochzeit, aktuelle_Gesamtzeit // Wird die Zeit für das aktuell ausgewählte Rezept gespeichert
let aktuelle_Kategorien = []
let Kochzeit_h, Kochzeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let Arbeitszeit_h, Arbeitszeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let Gesamtzeit_h, Gesamtzeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let zutatenListe = [], mengenListe = [], einheitenListe = [] //
let number_of_ingredients
let recipe_id
let time = {}



// Variablen mit allen fürs Anzeigen gebrauchten Informationen zuweisen
// Rezept-ID abfragen
function set_recipe_ID() {
    recipe_id = 21
}

// Rezept Werte zuweisen (Nährwerte, Name, Essgewohnheit Zeiten, Anleitung)
function aktuelles_Rezept_Werte_zuweisen(aktuell) { //ausgewähltes Rezept (mit variable "aktuell" übergeben, wird in die einzelnen Variablen definiert, um diese dann in folgenden Schritten aufrufen zu können
    if (aktuell <= Rezepte.length) { //überprüfen ob Rezept überhaupt vorhanden (eventuell unnötig)
        aktuelle_Nährwerte = Nährwerte[aktuell - 1] // Wir bei 1 anfangen und Computer bei 0 deshalb minus 1. Allgemein wird in den Zeilen einfach nur eine Zeile (mit Rezept_ID === aktuell) den jeweiligen Listen zugewiesen
        aktuelles_Rezept = Rezepte[aktuell - 1]
        aktuelle_Zutaten = Zutaten[aktuell - 1]

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

        if (vegane_Rezepte.includes(aktuell)){
            aktuelle_Kategorien.push("Vegan")
        }
        if (vegetarische_Rezepte.includes(aktuell)){
            aktuelle_Kategorien.push("Vegetarisch")
        }
        if (Fleisch_Rezepte.includes(aktuell)){
            aktuelle_Kategorien.push("mit Fleisch")
        }
        if (proteinreicheRezepte.includes(aktuell)){
            aktuelle_Kategorien.push("Proteinreich")
        }
        if (kalorienarmeRezepte.includes(aktuell)){
            aktuelle_Kategorien.push("Kalorienarm")
        }
        if (cheatmeals_Liste.includes(aktuell)){
            aktuelle_Kategorien.push("Cheat-Day")
        }
        // console.log(aktuelle_Kategorien)
        aktuelle_Kategorien.push("test")
        aktuelle_Kategorien.push("test")
        aktuelle_Kategorien.push("test")
        aktuelle_Kategorien.push("test")
    }
}

// Zutaten-Listen erstellen
function Zutaten_in_Listen_umwandeln(){
    zutatenListe.length = 0 //wichtig das die Listen sobald man von einem rezept aufs nächste klickt auch die Listen wieder leer sind
    mengenListe.length = 0
    einheitenListe.length = 0
    for (let i in aktuelle_Zutaten){ // jede Zutat wird einmal durchgegangen
        let menge = aktuelle_Zutaten[i] // die menge (wie viel von einer Zutat) wird gespeichert in "menge")
        if (menge !== null && i !== "Rezept_ID"){ // wenn die menge dann "Null" ist, dann ist diese Zutat nicht in diesem Rezept vorhanden (nur in anderen) und wird herausgefiltert. Natürlich Rezept_ID auch keine Zutat, deshalb auch rausgefiltert.
            zutatenListe.push(i) // falls aber alles passt, wird es in die Listen hinein gepushed (in richtiger Reihenfolge (Also wie in DB und nicht Alphabetisch (macht für uns keinen Unterschied))
            mengenListe.push(menge) //das gleiche mit der Menge
            let einheit_Objekte = Einheiten.find(Objekt_Zutat => Objekt_Zutat.Zutat === i); // da Einheiten eine Liste mit Objekten ist, muss dort die aktuelle zutat in den Objekten gesucht werden (find)
            einheitenListe.push(einheit_Objekte ? einheit_Objekte.Einheit : ""); // Falls keine Einheit gefunden wird, bleibt es leer
        }
    }
}

// Zeit in Minuten und Stunden rechnen
function zeit_umrechnen(){ //hier wird einfach nur die Zeit, falls sie über 60min ist umgerechnet in h und der rest bleibt in Minuten (wird aber auch mit ausgegeben)
    Arbeitszeit_h = Math.floor(aktuelle_Arbeitszeit / 60)
    Arbeitszeit_min = aktuelle_Arbeitszeit % 60

    Kochzeit_h = Math.floor(aktuelle_Kochzeit / 60)
    Kochzeit_min = aktuelle_Kochzeit % 60

    Gesamtzeit_h = Math.floor( aktuelle_Gesamtzeit / 60)
    Gesamtzeit_min = aktuelle_Gesamtzeit % 60

    time = [[Arbeitszeit_h, Arbeitszeit_min], [Kochzeit_h, Kochzeit_min], [Gesamtzeit_h, Gesamtzeit_min]]
}

// Anzahl der gewünschten Portionen extrahieren
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


// Informationen des Rezepts in die Website einfügen
// Rezeptname einfügen
function insert_recipe_name() {
    let recipe_name = document.getElementById("recipe-name")
    recipe_name.textContent = aktueller_Rezept_Name
}

// Nährwerte einfügen
function insert_nutrients() {
    let nutrients_list = Array.from(document.querySelectorAll(".naehrwertangaben .angabe"))
    for (let i = 0; i < nutrients_list.length; i++) {
        let value = nutrients_list[i].querySelector(".value")
        if (i === 0) {
            value.textContent = `${aktuell_Liste_Nährwerte[i]} kcal`
        } else {
            value.textContent = `${aktuell_Liste_Nährwerte[i]} g`
        }
    }
}

// Kategorien-Elemente einfügen
function insert_categories() {
    // Zutatenelemente im HTML klonen
    let kategorieangaben_frame = document.querySelector(".kategorieangaben")
    let kategorieangabe = document.querySelector(".kategorieangaben .angabe")
    for (let i = 1; i < aktuelle_Kategorien.length; i++) {
        let clone = kategorieangabe.cloneNode(true)
        kategorieangaben_frame.appendChild(clone)
    }

    // Namen der Kategorien einfügen
    insert_categories_names()
}

// Kategorien Namen einfügen
function insert_categories_names() {
    let category_information = Array.from(document.querySelectorAll(".kategorieangaben .value"))
    for (let i = 0; i < aktuelle_Kategorien.length; i++) {
        category_information[i].textContent = aktuelle_Kategorien[i]
    }
}

// Bild einfügen
function insert_picture() {
    let picture = document.querySelector(".block-bild-details .bild")
    picture.src = `../img/recipes/${recipe_id}/${Rezepte[recipe_id - 1].Bilder}` // hier anpassen, wenn wir mehrere Bilder in Rezepte.Bilder rein machen
}

// Zeiten einfügen
function insert_time(){//die definierten JS Variablen werden einfach in eine Variable in HTML gepackt
    let time_information = Array.from(document.querySelectorAll(".time-information"))
    let time_names = ["Vorbereitungszeit", "Koch/Backzeit", "Gesamtzeit"]
    // console.log("Zeiten-Liste: " + time)
    for (let i = 0; i < time_information.length; i++) {
        let value = time_information[i].querySelector(".value")
        // Aufbau time[]: [[Arbeitszeit_h, Arbeitszeit_min], [Kochzeit_h, Kochzeit_min], [Gesamtzeit_h, Gesamtzeit_min]]
        if (time[i][0] === 0) { // Stunden nein
            if (time[i][1] === 0) { // Stunden nein, Minuten nein
                time_information[i].style.display = "none"
            } else { // Stunden nein, Minuten ja
                value.innerText = `${time_names[i]}: ${time[i][1]} min`
            }
        } else { // Stunden ja
            if (time[i][1] === 0) { // Stunden ja, Minuten nein
                value.innerText = `${time_names[i]}: ${time[i][0]} h`
            } else { // Stunden ja, Minuten ja
                value.innerText = `${time_names[i]}: ${time[i][0]} h ${time[i][1]} min`
            }
        }
    }
}

// Anleitung einfügen
function insert_instructions() {
    let preparation_text = document.querySelector(".block-preparation-ingredients .text-preparation")
    preparation_text.innerText = aktuelle_Anleitung
}

// Zutaten-Elemente einfügen
function insert_ingredients() {
    number_of_ingredients = zutatenListe.length

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
function insert_ingredients_names_values() {
    let ingredients_list = Array.from(document.querySelectorAll(".ingredient"))
    let number_of_portions = extract_number_of_portions()
    for (let k = 0; k < number_of_ingredients; k++) {
        let ingredient_name = ingredients_list[k].querySelector(".name")
        let ingredient_value = ingredients_list[k].querySelector(".value")
        console.log("mengenliste: " + mengenListe)
        ingredient_name.textContent = zutatenListe[k]
        if (einheitenListe[k] === "") { // ohne Einheit
            if (mengenListe[k] === 0) {
                ingredient_value.textContent = ""
            } else {
                ingredient_value.textContent = number_of_portions * mengenListe[k]
            }
        } else { // mit Einheit
            ingredient_value.textContent = `${number_of_portions * mengenListe[k]} ${einheitenListe[k]}`
        }
    }
}

// Bildhöhe an die Höhe der Details daneben anpassen
function adjust_picture_height() {
    let picture = document.querySelector(".block-bild-details .bild")
    let picture_container = document.querySelector(".block-bild-details .bild-container")
    let details = document.querySelector(".block-bild-details .details")
    // Hohe des Bildes auf 534px oder größer setzen (wenn Details mehr Platz brauchen)
    if (details.offsetHeight > picture.offsetHeight) {
        picture_container.style.height = `${details.offsetHeight}px`
    } else {
        picture_container.style.height = "534px"
    }
}

// alle Informationen einfügen (Funktionen aufrufen)
function insert_recipe() {
    // Werte zuweisen
    set_recipe_ID()
    aktuelles_Rezept_Werte_zuweisen(recipe_id)
    Zutaten_in_Listen_umwandeln()
    zeit_umrechnen()

    // Informationen einfügen
    insert_recipe_name()
    insert_picture()
    insert_nutrients()
    insert_categories()
    insert_time()
    insert_instructions()
    insert_ingredients()

    // Bildhöhe an die Höhe der Details daneben anpassen
    setTimeout(adjust_picture_height,100)
}

insert_recipe()

// TODO: in DB ein Rezept mit id=0 einfügen, dass man bei der bildquelle nicht mehr "id - 1" braucht
// TODO: Zutatenmengen auf 2 Nachkommastellen runden

// TODO: share-button funktonierend machen

// TODO: angenommen, man öffnet das Rezept von außen über einen Link, dann ist ja noch kein sesionStorage da --> wenn keiner da ist, also datenbank abrufen --> vllt über einzelne JS Datei

// TODO: wenn wir mal mehr als 3 Kategorien pro Rezept haben, dann die Kategoriennamen 2 Stück nebeneinander machen