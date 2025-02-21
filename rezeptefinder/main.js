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
    console.log(window.Nährwerte)
    console.log(window.Rezepte)
    Nährwerte_mit_Rezept_überprüfen()
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
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Kalorien >= required_nutrients[i][1]){ //dann nach den Anforderungen die jeweiligen Objekte in der DB durchgehen
                            Kalorien_akzeptiert.push(window.Nährwerte[j].Rezept_ID); //wenn alles passt, kommt es in eine Liste die dann unten noch weiter überprüft wird
                        }
                    }
                } //das Ganze wird einfach für jeden Nährwert durchgeführt und jeweils immer in eine separate Liste gepushed
                else {
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Kalorien <= required_nutrients[i][1]){
                            Kalorien_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Eiweiß") {
                Protein_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Protein >= required_nutrients[i][1]){
                            Protein_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Protein <= required_nutrients[i][1]){
                            Protein_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Fett") {
                Fett_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Fett >= required_nutrients[i][1]){
                            Fett_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Fett <= required_nutrients[i][1]){
                            Fett_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Kohlenhydrate") {
                Kohlenhydrate_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Kohlenhydrate >= required_nutrients[i][1]){
                            Kohlenhydrate_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Kohlenhydrate <= required_nutrients[i][1]){
                            Kohlenhydrate_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "zuges. Zucker") {
                zugesetzer_Zucker_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].zugesetzer_Zucker >= required_nutrients[i][1]){
                            zugesetzer_Zucker_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].zugesetzer_Zucker <= required_nutrients[i][1]){
                            zugesetzer_Zucker_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
            else if (required_nutrients[i][0] === "Ballaststoffe") {
                Ballaststoffe_angeklickt = 1
                if (required_nutrients[i][2] === "min"){
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Ballaststoffe >= required_nutrients[i][1]){
                            Ballaststoffe_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
                else {
                    for (let j = 0; j < window.Nährwerte.length; j++) {
                        if (window.Nährwerte[j].Ballaststoffe <= required_nutrients[i][1]){
                            Ballaststoffe_akzeptiert.push(window.Nährwerte[j].Rezept_ID);
                        }
                    }
                }
            }
        }
        alle_Rezept_IDs = []
        for (let i = 0; i < window.Nährwerte.length; i++){
            alle_Rezept_IDs.push(window.Nährwerte[i].Rezept_ID)
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

        gefilterte_Rezepte_Nährwerte = alle_Rezept_IDs
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Kalorien_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Protein_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Fett_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id=> Kohlenhydrate_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id=> zugesetzer_Zucker_akzeptiert.includes(id))
        gefilterte_Rezepte_Nährwerte = gefilterte_Rezepte_Nährwerte.filter(id => Ballaststoffe_akzeptiert.includes(id))
        console.log(gefilterte_Rezepte_Nährwerte)
        Kategorien_mit_Rezept_überprüfen()
    }
    else{
        gefilterte_Rezepte_Nährwerte = alle_Rezept_IDs
        Kategorien_mit_Rezept_überprüfen()
    }
}


function Kategorien_mit_Rezept_überprüfen() {
    let vegan_angeklickt = 0, vegetarisch_angeklickt = 0, mit_Fleisch_angeklickt = 0,cheat_meals_angeklickt = 0, proteinreich_angeklickt = 0, kalorienarm_angeklickt = 0
    let vegan_akzeptiert =[], vegetarisch_akzeptiert = [], mit_Fleisch_akzeptiert = [], cheat_meals_akzeptiert = [], proteinreich_akzeptiert = [], kalorienarm_akzeptiert = []
    if(required_categories.length != 0){
        for (let i = 0; i < required_categories.length; i++) {
            if (required_categories[i] === "vegan"){
                gefilterte_Rezepte_Kategorien = window.vegane_Rezepte
            }
            else if (required_categories[i] === "vegetarisch"){
                for(let j = 0; j < window.vegetarische_Rezepte.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(window.vegetarische_Rezepte[j])){
                        gefilterte_Rezepte_Kategorien.push(window.vegetarische_Rezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "mit Fleisch"){
                for(let j = 0; j < window.Fleisch_Rezepte.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(window.Fleisch_Rezepte[j])){
                        gefilterte_Rezepte_Kategorien.push(window.Fleisch_Rezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "proteinreich"){
                for(let j = 0; j < window.proteinreicheRezepte.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(window.proteinreicheRezepte[j])){
                        gefilterte_Rezepte_Kategorien.push(window.proteinreicheRezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "kalorienarm"){
                for(let j = 0; j < window.kalorienarmeRezepte.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(window.kalorienarmeRezepte[j])){
                        gefilterte_Rezepte_Kategorien.push(window.kalorienarmeRezepte[j])
                    }
                }
            }
            else if (required_categories[i] === "für den Cheat-Day"){
                for(let j = 0; j < window.cheatmeals_Liste.length; j++){
                    if (!gefilterte_Rezepte_Kategorien.includes(window.cheatmeals_Liste[j])){
                        gefilterte_Rezepte_Kategorien.push(window.cheatmeals_Liste[j])
                    }
                }
            }
        }
        for (let i = 0; i < gefilterte_Rezepte_Nährwerte.length; i++)
            if (gefilterte_Rezepte_Kategorien.includes(gefilterte_Rezepte_Nährwerte[i])){
                gefilterte_Rezepte_fertig.push(gefilterte_Rezepte_Nährwerte[i])
        }
    }
    else{
        gefilterte_Rezepte_fertig = gefilterte_Rezepte_Nährwerte
    }
}
