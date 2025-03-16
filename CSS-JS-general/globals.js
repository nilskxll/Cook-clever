let header_big = document.getElementById("header-big")
let header_small = document.getElementById("header-small")
let header_big_search_bar = document.getElementById("sucheingabe-header-big")
let header_small_search_bar = document.getElementById("sucheingabe-header-small")
let header_small_spacer = document.getElementById("header-small-spacer")
let label_about_us_big = document.getElementById("label-about-us-big")
let label_about_us_small = document.getElementById("label-about-us-small")
let search_bar_big = document.getElementById("sucheingabe-header-big")
let search_bar_small = document.getElementById("sucheingabe-header-small")

let Nährwerte, Rezepte, Einheiten, Zutaten //Sind Matrizen die alle informationen der DB enthalten
let cheatmeals_Liste, kalorienarmeRezepte, proteinreicheRezepte, vegetarische_Rezepte, vegane_Rezepte, Fleisch_Rezepte // Sind Listen in den die Rezept_ID der jeweiligen Rezepte gespeichert werden, in welche Kategorie sie eben gerade passen


window.addEventListener("scroll", swap_header)
label_about_us_big.addEventListener("click", scroll_to_bottom)
label_about_us_small.addEventListener("click", scroll_to_bottom)
search_bar_big.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        suchFeld("sucheingabe-header-big")
    }
})
search_bar_small.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        suchFeld("sucheingabe-header-small")
    }
})


// beim Seite neu laden hochscrollen
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

// Header gross und klein beim Scrollen wechseln
function swap_header() {
    // console.log("scroll detect, position: " + window.scrollY)
    if (window.scrollY >= 50) {
        if (header_big.style.display === "") {
            header_big.style.display = "none"
            header_small.style.display = ""
            header_small_spacer.style.display = ""
            header_small_search_bar.value = header_big_search_bar.value
        }
    } else {
        if (header_big.style.display === "none") {
            header_big.style.display = ""
            header_small.style.display = "none"
            header_small_spacer.style.display = "none"
            header_big_search_bar.value = header_small_search_bar.value
        }
    }
}

// zum Footer scrollen, wenn man im Header auf About us klickt
function scroll_to_bottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight
    // console.log("about us gedrückt")
}

// wenn man im Suchfeld Enter drückt
function suchFeld(big_small_header) {
    let input = document.getElementById(big_small_header).value.toLowerCase(); // Eingabe aus dem HTML-Input holen
    let Rezepte_Suchanfrage_Liste_ID = []; // Liste für gefilterte Rezept-IDs

    for (let i = 0; i < Rezepte.length; i++) {
        let rezeptName = Rezepte[i].Rezeptname.toLowerCase(); // Rezeptname in Kleinbuchstaben umwandeln

        if (rezeptName.includes(input)) { // Prüfen, ob die Eingabe ein Teil des Namens ist
            Rezepte_Suchanfrage_Liste_ID.push(Rezepte[i].Rezept_ID); // Passende Rezept-ID speichern
        }
    }
    // console.log(Rezepte_Suchanfrage_Liste_ID); // Testausgabe der gefundenen Rezept-IDs
    sessionStorage.setItem("valid_IDs", JSON.stringify(Rezepte_Suchanfrage_Liste_ID)) // sessionStorage, dann Werte an Suchergebnisse-Seite übergeben werden können
    sessionStorage.setItem("search_term", JSON.stringify(input))
    window.location.href = "../suchergebnisse"
}


// Informationen der Datenbank in Matrizen speichern
function set_db_variables() {
    // Datenbank aus dem sessionStorage abrufen (wenn die DB nich geladen ist, steht überalle null drin)
    Rezepte = JSON.parse(sessionStorage.getItem("Rezepte"))
    Nährwerte = JSON.parse(sessionStorage.getItem("Nährwerte"))
    Zutaten = JSON.parse(sessionStorage.getItem("Zutaten"))
    Einheiten = JSON.parse(sessionStorage.getItem("Einheiten"))
    cheatmeals_Liste = JSON.parse(sessionStorage.getItem("cheatmeals_Liste"))
    kalorienarmeRezepte = JSON.parse(sessionStorage.getItem("kalorienarmeRezepte"))
    proteinreicheRezepte = JSON.parse(sessionStorage.getItem("proteinreicheRezepte"))
    vegetarische_Rezepte = JSON.parse(sessionStorage.getItem("vegetarische_Rezepte"))
    vegane_Rezepte = JSON.parse(sessionStorage.getItem("vegane_Rezepte"))
    Fleisch_Rezepte = JSON.parse(sessionStorage.getItem("Fleisch_Rezepte"))
    // überprüfen, ob die DB geladen ist oder nicht
    let db_lists = [
        Rezepte,
        Nährwerte,
        Zutaten,
        Einheiten,
        cheatmeals_Liste,
        kalorienarmeRezepte,
        proteinreicheRezepte,
        vegetarische_Rezepte,
        vegane_Rezepte,
        Fleisch_Rezepte
    ]
    let db_is_loaded = true
    db_lists.forEach((item) => {
        if (item === null) {
            db_is_loaded = false
        }
    })
    // Ist die DB geladen, wird im Programm fortgefahren, sonst wird sie erst geladen und dann fortgefahren.
    if (db_is_loaded) {
        console.log("Datenbank ist schon fertig geladen.")
        finished_db()
    } else {
        console.log("Datenbank ist noch nicht geladen.")
        daten_aus_db()
    }
}

// Informationen der Datenbank in Matrizen speichern
function daten_aus_db() {
    fetch('/cgi-bin/db_connection.php')
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

// Kategorienlisten erstellen
function einkategorisieren (){
    // müssen hier auf [] gesetzt werden, weil sie vorher in main.js auf null gesetzt wurden, da die DB noch nicht geladen war
    cheatmeals_Liste = []
    kalorienarmeRezepte = []
    proteinreicheRezepte = []
    vegetarische_Rezepte = []
    vegane_Rezepte = []
    Fleisch_Rezepte = []
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
    console.log("cheatmeal" + cheatmeals_Liste)
    console.log("kalorienarm" + kalorienarmeRezepte)
    console.log("protein " + proteinreicheRezepte)
    console.log("vegetarisch" + vegetarische_Rezepte)
    console.log("vagan " + vegane_Rezepte)
    console.log("fleisch " + Fleisch_Rezepte)
    finished_db()
}