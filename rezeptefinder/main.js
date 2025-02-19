let show_results_button = document.getElementById("show-results-button")
let required_categories = []
let required_nutrients = []


show_results_button.addEventListener("click", show_results)


// Klick auf die Checkboxen der Nährwerte pro Portion
/* alle Elemente der Klassenkombination ".naehrwertangaben .checkbox" auswählen, folgendes für jedes der Elemente ausführen:
   wenn die ausgewählte checkbox geklickt wird, werden der dazugehörige value-frame und toggle-switch-text-box angezeigt bzw. versteckt
   um nicht endlos IDs zu vergeben, geht es so mit den Klassen einfacher (mit closest und so)
*/
document.querySelectorAll(".naehrwertangaben .checkbox").forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {

        let parent = this.closest(".naehrwert-suchangabe")
        let value_frame = parent.querySelector(".value-frame")
        let toggle_switch = parent.querySelector(".toggle-switch-text-box")

        // visibility, dass bei hidden nicht geklickt werden kann
        // opacity für die transition
        if (this.checked) {
            value_frame.style.visibility="visible"
            toggle_switch.style.visibility="visible"
            value_frame.style.opacity="1"
            toggle_switch.style.opacity="1"
        } else {
            value_frame.style.opacity="0"
            toggle_switch.style.opacity="0"
            setTimeout(function () {
                value_frame.style.visibility="hidden"
                toggle_switch.style.visibility="hidden"
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
document.querySelectorAll(".naehrwertangaben .value").forEach(function (value) {
    value.addEventListener("input", function () {
        this.value = this.value.replace(/-/g, "") // /-/g ist ein regulärer Ausdruck, global im String sollen dadurch alle "-" Zeichen ersetzt werden bzw. der String wird komplett leer
    })
})


// Suchangaben extrahieren
// Nährwerte
function extract_nutrients () {
    document.querySelectorAll(".naehrwertangaben .checkbox").forEach(function(checkbox) {
        let parent = checkbox.closest(".naehrwert-suchangabe")
        let nutrition_name = parent.querySelector(".label-suchangabe").textContent
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
    document.querySelectorAll(".kategorieangaben .checkbox").forEach(function(checkbox) {
        if (checkbox.checked) {
            let parent = checkbox.closest(".kategorie-suchangabe")
            let category_name = parent.querySelector(".label-suchangabe").textContent

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
    Nährwerte_mit_Rezept_überprüfen()
}

//Nährwerte checken und schauen auf welche Rezepte die aktuell ausgewählten Nährwerte Anforderungen passen:

function Nährwerte_mit_Rezept_überprüfen (){
    let Kalorien_akzeptiert = [], Protein_akzeptiert = [], Fett_akzeptiert = [], Kohlenhydrate_akzeptiert = [], zugesetzer_Zucker_akzeptiert = [], Ballaststoffe_akzeptiert = []

    if (required_nutrients.length != 0) { //wenn die Null ist kann der ganze Teil übersprungen werden, da keine Einschränkung für Nährwerte gegeben wurde
        for (let i = 0; i < required_nutrients.length; i++) {
            if (required_nutrients[i][0] === "Energie") { //wenn der User Energie angeklickt hat, dann wird das überprüft
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
        //Hier die jeweiligen Listen miteinander Vergleichen. Die ID die in der jeder Liste vorhanden ist, kann in eine (halb) Finale Liste mit denen die der Suche entsprechen
    }
    else{
        Kategorien_mit_Rezept_überprüfen()

    }
}


function Kategorien_mit_Rezept_überprüfen(){
    //wie oben bei Nährwerten hier das gleiche nochmal mit den Kategorien. Am ende die zwei halben Listen überprüfen und die dann zu einer gemeinsamen zusammen mergen.
}
