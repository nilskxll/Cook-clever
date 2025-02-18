let show_results_button = document.getElementById("show-results-button")


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
    let required_nutrients = []
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
    let required_categories = []
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
}

//Nährwerte checken und schauen auf welche Rezepte die aktuell ausgewählten Nährwerte Anforderungen passen:
