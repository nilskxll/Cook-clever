let header_big = document.getElementById("header-big")
let header_small = document.getElementById("header-small")
let header_big_search_bar = document.getElementById("sucheingabe-header-big")
let header_small_search_bar = document.getElementById("sucheingabe-header-small")
let header_small_spacer = document.getElementById("header-small-spacer")
let label_about_us_big = document.getElementById("label-about-us-big")
let label_about_us_small = document.getElementById("label-about-us-small")
let kategorie_block_1 = document.getElementById("kategorie-block-1")
let kategorie_block_2 = document.getElementById("kategorie-block-2")
let kategorie_block_link_icon_rechts = document.getElementById("kategorie-block-link-icon-rechts")
let kategorie_block_link_icon_links = document.getElementById("kategorie-block-link-icon-links")
window.Nährwerte, window.Rezepte, window.Einheiten, window.Zutaten //Sind Matrizen die alle informationen der DB enthalten
window.cheatmeals_Liste = [], window.kalorienarmeRezepte = [], window.proteinreicheRezepte = [], window.vegetarische_Rezepte = [], window.vegane_Rezepte = [], window.Fleisch_Rezepte = [] // Sind Listen in den die Rezept_ID der jeweiligen Rezepte gespeichert werden, in welche Kategorie sie eben gerade passen

window.addEventListener("scroll", swap_header)
label_about_us_big.addEventListener("click", scroll_to_bottom)
label_about_us_small.addEventListener("click", scroll_to_bottom)
kategorie_block_link_icon_rechts.addEventListener("click", swap_kategorie_block)
kategorie_block_link_icon_links.addEventListener("click", swap_kategorie_block)


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

// angezeigte Kategorien wechseln, beim Klicken auf den Pfeil links bzw. rechts
function swap_kategorie_block() {
    // console.log("Kategorie swap gedrückt")
    if (kategorie_block_1.style.display === "") {
        kategorie_block_1.style.display = "none"
        kategorie_block_2.style.display = ""
    } else {
        kategorie_block_2.style.display = "none"
        kategorie_block_1.style.display = ""
    }
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
    console.log("Einkategoriesieren begonnen")// hier wird jeweils ein Objekt (eine Reihe von einem Rezept mit bestimmter ID überprüft, ob sie bestimmte Voraussetzungen hat. Wenn ja, wird sie mit der Rezept_ID hinzugefügt. Falls nein passiert nichts. (alles nur im Hintergrund)
    for ( let i = 0; i < window.Nährwerte.length; i++) {
        let Rezept_überprüfung = window.Nährwerte[i]
        if (Rezept_überprüfung.Kalorien >= 350) {               //Hier kann man einstellen, ab wann es eben zu den cheatmeals gehört
            window.cheatmeals_Liste.push(Rezept_überprüfung.Rezept_ID)
        }
        if(Rezept_überprüfung.Kalorien <= 300) {                //Hier kann man einstellen, ab wann es eben zu den Kalorienarmen gehört
            window.kalorienarmeRezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Protein >= 9){                   //Hier kann man einstellen, ab wann es eben zu den Eiweiß reichen Rezepten gehört
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
    console.log("Einkategoriesieren beendet")
}
/*
function suchFeld(){
    let Rezepte_Namen_Liste = []
    let Rezepte_ID_Liste = []
    for (i = 0; i <= Rezepte.length; i++){
        let Rezept_überprüfung  = Rezepte[i]
        Rezepte_Namen_Liste.push(Rezept_überprüfung.Rezeptname)
        Rezepte_ID_Liste.push(Rezept_überprüfung.Rezept_ID)
    }
    for (i = 0; i <= Rezepte_Namen_Liste.length; i++){
        if ( (((das aus der html Datei, was eben durch das Suchfeld eingegeben wurde)))  = Rezepte_Namen_Liste[i]){ //Teil des Wortes und dann eben eine Liste mit Rezept_ID, diese dann alle so klein  auf einer website ausgeben!
            let Rezepte_Suchanfrage_Liste_ID = Rezepte_ID_Liste[i]    //Hier sollte jetzt eben alle Rezept_Ids in einer Liste gespeichert werden, in denen eben die reinfolge an buchstaben in dem Namen vorkommt.
            //mit diesern Liste dann auf die nächste HTML Website gehen und dann alle Rezepte mit diesen IDs in so kleinen Vorschaukästchen ausgeben
        }
    }
    console.log(Rezepte)
}
*/
daten_aus_db(einkategorisieren)