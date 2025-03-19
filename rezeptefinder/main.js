let question_mark_box = document.querySelector(".question-mark-box")
let show_results_button = document.getElementById("show-results-button")
let required_categories = []
let required_nutrients = []
let valid_nutrients_ids = []
let valid_category_ids = []
let valid_ids = []
let alle_Rezept_IDs = []

set_db_variables()

question_mark_box.addEventListener("mouseenter", trigger_help)
question_mark_box.addEventListener("mouseleave", trigger_help)
show_results_button.addEventListener("click", show_results)



// Hovern über das Fragezeichen-Icon
function trigger_help() {
    let help_text_box = document.querySelector(".help-text-box")
    help_text_box.classList.toggle("active")
}


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
            if (category_name === "vegetarisch") { // bei der Kategorie vegetarisch auch nach vegan suchen
                required_categories.push("vegan")
            }
        }
    })

    return required_categories
}

// Suchangaben ausgeben
function show_results () {
    // console.log("---------------------------------------")
    // console.log("Suche starten")
    // Listen leer machen
    valid_nutrients_ids.length = 0
    valid_category_ids.length = 0
    valid_ids.length = 0
    required_categories.length = 0
    required_nutrients.length = 0

    alle_Rezept_IDs.length = 0
    for (let i = 0; i < Nährwerte.length; i++) {
        alle_Rezept_IDs.push(Nährwerte[i].Rezept_ID)
    }

    // Kategorien
    required_categories = extract_categories()
    required_categories = [...new Set(required_categories)] // new Set() erstellt ein Set ohne Dopplungen [...] macht das Set zu einem Array (vegan könnte doppelt drin stehen, falls vegan und vegetarisch ausgewählt werden)
    sessionStorage.setItem("required_categories", JSON.stringify(required_categories))

    // Nährwerte
    required_nutrients = extract_nutrients()
    sessionStorage.setItem("required_nutrients", JSON.stringify(required_nutrients))

    // console.log("suche in Nährwerten:")
    // console.log(required_nutrients)
    // console.log("suche in kategorien:")
    // console.log(required_categories)

    // console.log("Nährwert-Matrix:", Nährwerte)
    // console.log("Rezepte-Matrix:", Rezepte)

    // filtern (Funktionen sollten normalerweise nacheinander ablaufen, da keine von denen asynchron abläuft)
    filter_recipes_nutrients()
    filter_recipes_categories()
    combine_filter_recipes()

    // Suchergebnisse-Seite öffnen
    sessionStorage.setItem("valid_IDs", JSON.stringify(valid_ids))
    window.location.href = "../suchergebnisse"
}

//Nährwerte checken und schauen auf welche Rezepte die aktuell ausgewählten Nährwerte Anforderungen passen:

function filter_recipes_nutrients() {
    let nutrient_map = { // nötig, da die Namen der Nährwerte in required_nutrients-Liste anders als in der Nährwerte-Matrix sind
        "Energie": "Kalorien",
        "Eiweiß": "Protein",
        "Fett": "Fett",
        "Kohlenhydrate": "Kohlenhydrate",
        "zuges. Zucker": "zugesetzer_Zucker",
        "Ballaststoffe": "Ballaststoffe"
    }
    valid_nutrients_ids = alle_Rezept_IDs // alle Rezept-IDs hinzufügen, dass hiernach aussortiert werden kann

    // Aufbau der Matrix required_nutrients: [[nutrient_name, value, min/max], [nutrient_name, value, min/max], ...]
    if (required_nutrients.length !== 0) { // nur wenn auch nach Nährwerten gefiltert wird
        Rezepte.forEach((recipe) => { // jedes Rezept überprüfen
            let recipe_id = recipe.Rezept_ID
            let recipe_nutrients = Nährwerte[recipe_id] // Nährwerte des aktuellen Rezepts
            for (let i = 0; i < required_nutrients.length; i++) { // alle Nährwerte der Sucheingabe überprüfen
                let nutrient = nutrient_map[required_nutrients[i][0]]
                let value = required_nutrients[i][1]
                let type = required_nutrients[i][2]
                if (type === "min") {
                    if (recipe_nutrients[nutrient] < value) { // wenn der Wert weniger als die Suchvorgabe ist
                        // console.log("eigenschaft schlecht:",nutrient, "Wert:", recipe_nutrients[nutrient], "Typ", type)
                        // console.log("id zum rausschmeißen:", recipe_id)
                        valid_nutrients_ids = valid_nutrients_ids.filter(id => id !== recipe_id) // aktuelle ID aus valid_nutrient_ids entfernen, weil min nicht erfüllt ist
                    } // else {console.log("eigenschaft gut:",nutrient, "Wert:", recipe_nutrients[nutrient], "Typ", type)}
                } else {
                    if (recipe_nutrients[nutrient] > value) { // wenn der Wert höher als die Suchvorgabe ist
                        // console.log("eigenschaft schlecht:",nutrient, "Wert:", recipe_nutrients[nutrient], "Typ", type)
                        // console.log("id zum rausschmeißen:", recipe_id)
                        valid_nutrients_ids = valid_nutrients_ids.filter(id => id !== recipe_id) // aktuelle ID aus valid_nutrient_ids entfernen, weil max nicht erfüllt ist
                    } // else {console.log("eigenschaft gut:",nutrient, "Wert:", recipe_nutrients[nutrient], "Typ", type)}
                }
            }
        })
    }
}

function filter_recipes_categories() {
    let required_categories_eating_habits = []
    required_categories_eating_habits.length = 0

    let required_categories_others = []
    required_categories_others.length = 0

    let eating_habits = ["vegetarisch", "vegan", "mit Fleisch"]

    // Kategorienlisten erstellen (brauchen eine Liste für die Essgewohnheiten und eine Liste für die anderen kategorien (also proteinreich...))
    for (let i of required_categories) {
        if (eating_habits.includes(i)) {
            required_categories_eating_habits.push(i)
        } else {
            required_categories_others.push(i)
        }
    }

    // console.log("gesuchte essgewohnheiten:", required_categories_eating_habits)
    // console.log("gesuchte restliche kategorien:", required_categories_others)

    // Rezepte nach Essgewohnheiten filtern
    if (required_categories_eating_habits.length === 0) { // wenn Essgewohnheiten egal sind
        valid_category_ids = alle_Rezept_IDs
        // console.log("keine essgewohnheiten gesucht")
    } else {
        Rezepte.map((row) => { // wenn nach Essgewohnheiten gefiltert wird
            // console.log("es wird nach gewohnheiten gesucht")
            for (let i of required_categories_eating_habits) {
                if (row.Essgewohnheit === i) {
                    valid_category_ids.push(row.Rezept_ID)
                }
            }
        })
    }

    // vorgefilterte Rezepte (Essgewohnheiten) noch mit den anderen Kategorien filtern
    if (required_categories_others.includes("proteinreich")) {
        valid_category_ids = valid_category_ids.filter(id => proteinreicheRezepte.includes(id))
    }
    if (required_categories_others.includes("kalorienarm")) {
        valid_category_ids = valid_category_ids.filter(id => kalorienarmeRezepte.includes(id))
    }
    if (required_categories_others.includes("für den Cheat-Day")) {
        valid_category_ids = valid_category_ids.filter(id => cheatmeals_Liste.includes(id))
    }
}

function combine_filter_recipes() {
    // nur die IDs übernehmen, wo die Nährwerte und Kategorien passen
    valid_ids = valid_nutrients_ids.filter(id => valid_category_ids.includes(id))
    // console.log("gefilterte nutrient ids:",valid_nutrients_ids)
    // console.log("gefilterte category IDs:", valid_category_ids)
    // console.log("insgesamt passende IDs:", valid_ids)
}



function finished_db() {
    // wird bei set_db_variables() am Ende aufgerufen
    // sessionStorage könnte auch außerhalb der Funktion stehen, aber finished_db() muss es geben, dass kein Fehler geschmissen wird
    sessionStorage.setItem("search_term", JSON.stringify(""))
    sessionStorage.setItem("required_categories", JSON.stringify(""))
    sessionStorage.setItem("required_nutrients", JSON.stringify(""))
}