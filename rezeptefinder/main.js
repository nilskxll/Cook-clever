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

let show_results_button = document.getElementById("show-results-button")
let required_categories = []
let required_nutrients = []
let gefilterte_Rezepte_Nährwerte = []
let gefilterte_Rezepte_fertig = []
let gefilterte_Rezepte_Kategorien = []
let alle_Rezept_IDs = []

show_results_button.addEventListener("click", show_results)


// Klick auf die Checkboxen der Nährwerte pro Portion
/* alle Elemente der Klassenkombination ".nutritional-filters-frame .checkbox" auswählen, folgendes für jedes der Elemente ausführen:
   wenn die ausgewählte checkbox geklickt wird, werden der dazugehörige value-frame und toggle-switch-text-box angezeigt bzw. versteckt
   um nicht endlos IDs zu vergeben, geht es so mit den Klassen einfacher (mit closest und so)
*/
document.querySelectorAll(".nutritional-filters-frame .checkbox").forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {
        let parent = this.closest(".nutritional-filter")
        let value_frame = parent.querySelector(".value-frame")
        let value = parent.querySelector(".value")
        let toggle_switch_text_box = parent.querySelector(".toggle-switch-text-box")
        let toggle_switch = parent.querySelector(".toggle-switch")

        // visibility, dass bei hidden nicht geklickt werden kann
        // opacity für die transition
        if (this.checked) {
            value_frame.style.visibility="visible"
            toggle_switch_text_box.style.visibility="visible"
            value_frame.style.opacity="1"
            toggle_switch_text_box.style.opacity="1"
        } else {
            value_frame.style.opacity="0"
            toggle_switch_text_box.style.opacity="0"
            setTimeout(function () {
                value_frame.style.visibility="hidden"
                toggle_switch_text_box.style.visibility="hidden"
                value.value = ""
                if (toggle_switch.classList.contains("active")) {
                    toggle_switch.classList.remove("active")
                }
            }, 300)
        }
    })
})

// Klick auf die toggle-switches der Nährwerte pro Portion
/* alle Elemente der Klasse ".toggle-switch" auswählen, folgendes für jedes der Elemente ausführen:
   click-EventListener hinzufügen, der bei Auslösung die Klasse ".active" auf das aktuelle Element hinzufügt bzw. entfernt
 */
document.querySelectorAll(".toggle-switch").forEach(function (toggle_switch) {
    toggle_switch.addEventListener("click", function () {
        toggle_switch.classList.toggle("active");

        let parent = this.closest(".toggle-switch-text-box")
        let min_max = parent.querySelector(".text-wrapper-2")

        setTimeout(function () {
            if (min_max.textContent === "min.") {
                min_max.textContent = "max."
            } else {
                min_max.textContent = "min."
            }
        },150)
    });
});

// keine negativen Eingaben bei Nährwerten zulassen
document.querySelectorAll(".nutritional-filters-frame .value").forEach(function (value) {
    value.addEventListener("input", function () {
        this.value = this.value.replace(/-/g, "") // /-/g ist ein regulärer Ausdruck, global im String sollen dadurch alle "-" Zeichen ersetzt werden bzw. der String wird komplett leer
    })
})


// Suchangaben extrahieren
// Nährwerte
function extract_nutrients () {
    document.querySelectorAll(".nutritional-filters-frame .checkbox").forEach(function(checkbox) {
        let parent = checkbox.closest(".nutritional-filter")
        let nutrition_name = parent.querySelector(".label-filter-name").textContent
        let value = parent.querySelector(".value").value
        let switch_min_max = parent.querySelector(".toggle-switch")

        if (checkbox.checked && value !== "") {
            if (switch_min_max.classList.contains("active")) {
                required_nutrients.push([nutrition_name, Number(value), "max"])
            } else {
                required_nutrients.push([nutrition_name, Number(value), "min"])
            }
        }
    })

    return required_nutrients
}

// Kategorien
function extract_categories () {
    document.querySelectorAll(".category-filters-frame .checkbox").forEach(function(checkbox) {
        if (checkbox.checked) {
            let parent = checkbox.closest(".category-filter")
            let category_name = parent.querySelector(".label-filter-name").textContent

            // "Kategorie" vom Kategorienamen entfernen
            let words = category_name.split(" ")
            words.shift()
            category_name = words.join(" ")

            required_categories.push(category_name)
        }
    })

    return required_categories
}

// Suchangaben ausgeben
function show_results () {
    // Kategorien
    let required_categories = extract_categories()

    // Nährwerte
    let required_nutrients = extract_nutrients()

    console.log("suche Nährwerte:")
    console.log(required_nutrients)

    console.log("suche in kategorien:")
    console.log(required_categories)
    console.log(Nährwerte)
    console.log(Rezepte)
    Nährwerte_mit_Rezept_überprüfen()
    setTimeout(function(){
        sessionStorage.setItem("valid_IDs", JSON.stringify(gefilterte_Rezepte_fertig))
        window.location.href = "../suchergebnisse"
        }, 2000)
}

//Nährwerte checken und schauen auf welche Rezepte die aktuell ausgewählten Nährwerte Anforderungen passen:

function Nährwerte_mit_Rezept_überprüfen (){
    let Kalorien_akzeptiert = [], Protein_akzeptiert = [], Fett_akzeptiert = [], Kohlenhydrate_akzeptiert = [], zugesetzer_Zucker_akzeptiert = [], Ballaststoffe_akzeptiert = []
    let Kalorien_angeklickt = 0, Protein_angeklickt = 0, Fett_angeklickt = 0, Kohlenhydrate_angeklickt = 0, zugesetzer_Zucker_angeklickt = 0, Ballaststoffe_angeklickt = 0

    if (required_nutrients.length != 0) { //wenn die Null ist kann der ganze Teil übersprungen werden, da keine Einschränkung für Nährwerte gegeben wurde
        for (let i = 0; i < required_nutrients.length; i++) {
            if (required_nutrients[i][0] === "Energie") { //wenn der User Energie angeklickt hat, dann wird das überprüft
                Kalorien_angeklickt = 1 //zeigt für den Schluss an, ob eben diese Nährwertangabe mit Energie angeklickt wurde oder eben nicht
                if (required_nutrients[i][2] === "min"){ //geschaut, ob eben min oder max gefragt falls max macht er das selbe nur bei der else schleife
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Kalorien >= required_nutrients[i][1]){ //dann nach den Anforderungen die jeweiligen Objekte in der DB durchgehen
                            Kalorien_akzeptiert.push(Nährwerte[j].Rezept_ID); //wenn alles passt, kommt es in eine Liste die dann unten noch weiter überprüft wird
                        }
                    }
                } //das Ganze wird einfach für jeden Nährwert durchgeführt und jeweils immer in eine separate Liste gepushed
                else {
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Kalorien <= required_nutrients[i][1]){
                            Kalorien_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Eiweiß") {
                Protein_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Protein >= required_nutrients[i][1]){
                            Protein_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Protein <= required_nutrients[i][1]){
                            Protein_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Fett") {
                Fett_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Fett >= required_nutrients[i][1]){
                            Fett_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Fett <= required_nutrients[i][1]){
                            Fett_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Kohlenhydrate") {
                Kohlenhydrate_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Kohlenhydrate >= required_nutrients[i][1]){
                            Kohlenhydrate_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Kohlenhydrate <= required_nutrients[i][1]){
                            Kohlenhydrate_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "zuges. Zucker") {
                zugesetzer_Zucker_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].zugesetzer_Zucker >= required_nutrients[i][1]){
                            zugesetzer_Zucker_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].zugesetzer_Zucker <= required_nutrients[i][1]){
                            zugesetzer_Zucker_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Ballaststoffe") {
                Ballaststoffe_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Ballaststoffe >= required_nutrients[i][1]){
                            Ballaststoffe_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < Nährwerte.length; j++) {
                        if (Nährwerte[j].Ballaststoffe <= required_nutrients[i][1]){
                            Ballaststoffe_akzeptiert.push(Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
        }
        alle_Rezept_IDs = []
        for (let i = 0; i < Nährwerte.length; i++){
            alle_Rezept_IDs.push(Nährwerte[i].Rezept_ID)
        }
        if (Kalorien_akzeptiert.length === 0 && Kalorien_angeklickt === 0){ //hier alle Listen durchgehen, ob sie leer sind und aus welchem Grund sie leer sind (nicht abgefragt oder kein rezept gefunden) (falls leer, weil nicht angeklickt, werden denen alle Rezept_IDs zugewiesen.
                Kalorien_akzeptiert = alle_Rezept_IDs.slice()
        }
        if (Protein_akzeptiert.length === 0 && Protein_angeklickt === 0){ //hier alle Listen durchgehen, ob sie leer sind und aus welchem Grund sie leer sind (nicht abgefragt oder kein rezept gefunden)
                Protein_akzeptiert = alle_Rezept_IDs.slice()
        }
        if (Fett_akzeptiert.length === 0 && Fett_angeklickt === 0){ //hier alle Listen durchgehen, ob sie leer sind und aus welchem Grund sie leer sind (nicht abgefragt oder kein rezept gefunden)
                Fett_akzeptiert = alle_Rezept_IDs.slice()
        }
        if (Kohlenhydrate_akzeptiert.length === 0 && Kohlenhydrate_angeklickt === 0){ //hier alle Listen durchgehen, ob sie leer sind und aus welchem Grund sie leer sind (nicht abgefragt oder kein rezept gefunden)
                Kohlenhydrate_akzeptiert = alle_Rezept_IDs.slice()
        }
        if (zugesetzer_Zucker_akzeptiert.length === 0 && zugesetzer_Zucker_angeklickt === 0){ //hier alle Listen durchgehen, ob sie leer sind und aus welchem Grund sie leer sind (nicht abgefragt oder kein rezept gefunden)
                zugesetzer_Zucker_akzeptiert = alle_Rezept_IDs.slice()
        }
        if (Ballaststoffe_akzeptiert.length === 0 && Ballaststoffe_angeklickt === 0){ //hier alle Listen durchgehen, ob sie leer sind und aus welchem Grund sie leer sind (nicht abgefragt oder kein rezept gefunden)
                Ballaststoffe_akzeptiert = alle_Rezept_IDs.slice()
        }
        //Hier die jeweiligen Listen miteinander Vergleichen. Die ID die in der jeder Liste vorhanden ist, kann in eine (halb) Finale Liste mit denen die der Suche entsprechen

        gefilterte_Rezepte_Nährwerte = alle_Rezept_IDs //hier wird erstmal die Liste voll mit allen
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Kalorien_akzeptiert.includes(id)) //in den folgenden Zeilen wird geschaut ob eben gefilterte_Rezepte_Nährwerte und Kalorien_akzeptiert gleiche Elemente haben. Die werden dann wieder in der gefilterte_Rezepte_Nährwerte geschrieben und mit der nächsten Liste verglichen
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Protein_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Fett_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id=> Kohlenhydrate_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id=> zugesetzer_Zucker_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Ballaststoffe_akzeptiert.includes(id))
        console.log(gefilterte_Rezepte_Nährwerte)
        Kategorien_mit_Rezept_überprüfen() //nun ist er hiermit fertig und soll die Kategorien überprüfen
    }
    else{
        gefilterte_Rezepte_Nährwerte = alle_Rezept_IDs
        Kategorien_mit_Rezept_überprüfen()
    }
}


function Kategorien_mit_Rezept_überprüfen() {
    let vegan_angeklickt = 0, vegetarisch_angeklickt = 0, mit_Fleisch_angeklickt = 0,cheat_meals_angeklickt = 0, proteinreich_angeklickt = 0, kalorienarm_angeklickt = 0
    let vegan_akzeptiert =[], vegetarisch_akzeptiert = [], mit_Fleisch_akzeptiert = [], cheat_meals_akzeptiert = [], proteinreich_akzeptiert = [], kalorienarm_akzeptiert = []
    if(required_categories.length != 0){ //schaut wieder ob es überhaupt ausgewählte Kategorien gibt die nachgefragt werden
        for (let i = 0; i < required_categories.length; i++) { //geht jedes Element aus der Liste durch
            if (required_categories[i] === "vegan"){
                gefilterte_Rezepte_Kategorien = vegane_Rezepte //falls vegan angeklickt wurde dann soll er einfach
            }
            else if (required_categories[i] === "vegetarisch"){
                for(let j = 0; j < vegetarische_Rezepte.length; j++){ //falls eben vegetarisch, durchläuft er alle elemente von den vegetarischen Rezepten
                    if (!gefilterte_Rezepte_Kategorien.includes(vegetarische_Rezepte[j])){ //falls es noch nicht in der aktuellen gefilterte_Rezepte_Kategorien vorhanden ist, fügt er es hinzu, falls nicht überprüft er das nächste Objekt
                        gefilterte_Rezepte_Kategorien.push(vegetarische_Rezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "mit Fleisch"){
                for(let j = 0; j < Fleisch_Rezepte.length; j++){ //das gleiche wie bei vegetarisch ...
                    if (!gefilterte_Rezepte_Kategorien.includes(Fleisch_Rezepte[j])){
                        gefilterte_Rezepte_Kategorien.push(Fleisch_Rezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "proteinreich"){
                for(let j = 0; j < proteinreicheRezepte.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(proteinreicheRezepte[j])){
                        gefilterte_Rezepte_Kategorien.push(proteinreicheRezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "kalorienarm"){
                for(let j = 0; j < kalorienarmeRezepte.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(kalorienarmeRezepte[j])){
                        gefilterte_Rezepte_Kategorien.push(kalorienarmeRezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "für den Cheat-Day"){
                for(let j = 0; j < cheatmeals_Liste.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(cheatmeals_Liste[j])){
                        gefilterte_Rezepte_Kategorien.push(cheatmeals_Liste[j])
                    }
                }
            }
        }
        for (let i = 0; i < gefilterte_Rezepte_Nährwerte.length; i++) //Beide listen werden miteinander verbunden und überprüft. Wenn diese ein gleiches Element haben, dann wird es in die endgültige Liste geschrieben
            if (gefilterte_Rezepte_Kategorien.includes(gefilterte_Rezepte_Nährwerte[i])){
                gefilterte_Rezepte_fertig.push(gefilterte_Rezepte_Nährwerte[i])
        }
    }
    else{ //Falls es keine einschränkungen gibt, dann werden einfach die Nährwert einschränkungen übernommen
        gefilterte_Rezepte_fertig = gefilterte_Rezepte_Nährwerte
    }
}