let header_big = document.getElementById("header-big")
let header_small = document.getElementById("header-small")
let header_big_search_bar = document.getElementById("sucheingabe-header-big")
let header_small_search_bar = document.getElementById("sucheingabe-header-small")
let header_small_spacer = document.getElementById("header-small-spacer")
let label_about_us_big = document.getElementById("label-about-us-big")
let label_about_us_small = document.getElementById("label-about-us-small")
let search_bar_big = document.getElementById("sucheingabe-header-big")
let search_bar_small = document.getElementById("sucheingabe-header-small")
window.Nährwerte, window.Rezepte, window.Einheiten, window.Zutaten //Sind Matrizen die alle informationen der DB enthalten
window.cheatmeals_Liste = [], window.kalorienarmeRezepte = [], window.proteinreicheRezepte = [], window.vegetarische_Rezepte = [], window.vegane_Rezepte = [], window.Fleisch_Rezepte = [] // Sind Listen in den die Rezept_ID der jeweiligen Rezepte gespeichert werden, in welche Kategorie sie eben gerade passen

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
    console.log("about us gedrückt")
}


function daten_aus_db(callback) {
    fetch('cgi-bin/db_connection.php')
        .then(response => response.json())
        .then(daten => {
            //Daten aus der PHP Datei in die Matrizen einfügen, damit man in JS damit arbeiten kann
            window.Nährwerte = daten.naehrwerte
            window.Rezepte = daten.rezepte
            window.Einheiten = daten.einheiten
            window.Zutaten = daten.zutaten
            console.log("daten geladen")
            // Callback ausführen, um nach dem Abrufen der Daten weiterzuarbeiten
            if (callback) {
                callback();  // Rufe die Callback-Funktion auf
            }

        })
        .catch(error => { //Falls irgendwo nen Fehler auftritt, sieht man gleich über den error warum
            console.error("Fehler beim Abrufen der Daten:", error)
        })
}

function einkategorisieren (){
    // hier wird jeweils ein Objekt (eine Reihe von einem Rezept mit bestimmter ID überprüft, ob sie bestimmte Voraussetzungen hat. Wenn ja, wird sie mit der Rezept_ID hinzugefügt. Falls nein passiert nichts. (alles nur im Hintergrund)
    for ( let i = 0; i < window.Nährwerte.length; i++) {
        let Rezept_überprüfung = window.Nährwerte[i]
        if (Rezept_überprüfung.Kalorien >= 800) {               //Hier kann man einstellen, ab wann es eben zu den cheatmeals gehört
            window.cheatmeals_Liste.push(Rezept_überprüfung.Rezept_ID)
        }
        if(Rezept_überprüfung.Kalorien <= 300) {                //Hier kann man einstellen, ab wann es eben zu den Kalorienarmen gehört
            window.kalorienarmeRezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Protein >= 40){                   //Hier kann man einstellen, ab wann es eben zu den Eiweiß reichen Rezepten gehört
            window.proteinreicheRezepte.push(Rezept_überprüfung.Rezept_ID)
        }
    }
    for (let i = 0; i < window.Rezepte.length; i++){
        let Rezept_überprüfung = window.Rezepte[i]
        if (Rezept_überprüfung.Essgewohnheit === "vegetarisch"){
            window.vegetarische_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit === "vegan"){
            window.vegane_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit === "mit Fleisch"){
            window.Fleisch_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
    }
}
function suchFeld(big_small) {
    let input = document.getElementById(big_small).value.toLowerCase(); // Eingabe aus dem HTML-Input holen
    let Rezepte_Suchanfrage_Liste_ID = []; // Liste für gefilterte Rezept-IDs

    for (let i = 0; i < Rezepte.length; i++) {
        let rezeptName = Rezepte[i].Rezeptname.toLowerCase(); // Rezeptname in Kleinbuchstaben umwandeln

        if (rezeptName.includes(input)) { // Prüfen, ob die Eingabe ein Teil des Namens ist
            Rezepte_Suchanfrage_Liste_ID.push(Rezepte[i].Rezept_ID); // Passende Rezept-ID speichern
        }
    }
    console.log(Rezepte_Suchanfrage_Liste_ID); // Testausgabe der gefundenen Rezept-IDs
}
daten_aus_db(einkategorisieren)