let valid_IDs = JSON.parse(sessionStorage.getItem("valid_IDs"))
// console.log("übergebene IDs: " + valid_IDs)

let number_of_recipes = valid_IDs.length
let number_of_recipe_blocks = Math.round(number_of_recipes / 2)


// anzeigen, wonach gesucht wurde
function insert_search_information() {
    let subheading = document.querySelector(".heading-subheading .subheading")
    let search_criteria = document.querySelector(".heading-subheading .filters")

    // wenn mit der Suchleiste gesucht wurde
    let search_term = JSON.parse(sessionStorage.getItem("search_term"))
    if (search_term) {
        search_criteria.innerText = search_term
        return
    }

    // wenn mit dem Rezeptefinder gesucht wurde
    let search_criteria_text = ""
    // Kategorieangaben
    let required_categories = JSON.parse(sessionStorage.getItem("required_categories"))
    if (required_categories[0]) { // nur ausführen, wenn die Liste Inhalt hat
        search_criteria_text += `Kategorien:\nRezepte ${required_categories.join("\nRezepte ")}`
    }
    // Nährwertangaben
    let required_nutrients = JSON.parse(sessionStorage.getItem("required_nutrients"))
    if (required_nutrients[0]) { // nur ausführen, wenn die Liste Inhalt hat
        let nutrients_text = ""
        if (search_criteria_text) { // wenn schon Kategorien im Text stehen, Platz einfügen
            nutrients_text = "\n\nNährwerte:\n"
        } else {
            nutrients_text = "Nährwerte:\n"
        }

        if (Array.isArray(required_nutrients[0])) { // wenn nach mehr als einem Nährwert gefiltert wird, muss eine Matrix formatiert werden
            for (let i = 0; i < required_nutrients.length; i++) {
                nutrients_text += `${required_nutrients[i][0]}:`
                nutrients_text += `\u00A0\u00A0${required_nutrients[i][1]} g\u00A0\u00A0` // zwei geschützte Leerzeichen, dass die von HTML nicht zu einem zusammengefasst werden
                nutrients_text += `(${required_nutrients[i][2]})\n`
            }
        } else { // wenn nach genau einem Nährwert gefiltert wird, muss ein normales Array formatiert werden
            nutrients_text += `${required_nutrients[0]}:`
            nutrients_text += `\u00A0\u00A0${required_nutrients[1]} g\u00A0\u00A0`
            nutrients_text += `(${required_nutrients[2]})`
        }
        search_criteria_text += nutrients_text
    }
    // Text anzeigen
    if (search_criteria_text) {
        search_criteria.innerText = search_criteria_text
        return
    }

    // wenn gar keine Sucheingaben/Filter eingefügt wurden, subheading komplett wegmachen
    subheading.style.display = "none"
}

// Rezepte-Rows (nach gewünschter Anzahl) erstellen
function insert_recipes_blocks() {
    // Rezepte-Rows einfügen (2 Rezepte-Karten pro Row)
    let recipes_block = document.querySelector(".block-recipes")
    let recipes_row = document.querySelector(".recipes-row")
    let nothing_found_block = document.querySelector(".block-nothing-found")
    // wenn keine Rezepte gefunden wurden
    if (number_of_recipes === 0) {
        recipes_block.style.display="none"
        nothing_found_block.style.display=""
        return
    }
    nothing_found_block.style.display="none"
    // wenn Rezepte gefunden wurden
    for (let i = 0; i < number_of_recipe_blocks - 1; i++) {
        let clone = recipes_row.cloneNode(true)
        recipes_block.appendChild(clone)
    }
    // letzte Rezepte-Karte entfernen, wenn ungerade Anzahl Rezepte gewünscht ist
    if (number_of_recipes % 2 === 1) {
        let recipe_cards_list = Array.from(document.querySelectorAll(".recipe-card"))
        let last_recipe_card = recipe_cards_list[recipe_cards_list.length - 1]
        last_recipe_card.style.display = "none"
    }
}

// Rezepte in die recipe-cards einfügen
function insert_recipe_card_information() {
    let list_IDs = valid_IDs
    let recipe_cards = Array.from(document.querySelectorAll(".recipe-card"))
    for (let i = 0; i < number_of_recipes; i++) {
        let recipe_name = recipe_cards[i].querySelector(".label-text")
        let image = recipe_cards[i].querySelector(".image")

        recipe_name.textContent = Rezepte[list_IDs[i]].Rezeptname
        // console.log("Rezeptname: " + recipe_name.textContent)
        image.src = `../img/recipes/${list_IDs[i]}/${Rezepte[list_IDs[i]].Bilder}` // hier anpassen, wenn wir mehrere Bilder in Rezepte.Bilder rein machen
        // console.log("Bildquelle: " + image.srcText)
    }
}

// Event-Listeners auf die Link-Buttons hinzufügen, um Rezepte öffnen zu können
function add_recipe_link_event_listeners() {
    let links_open_recipe = document.querySelectorAll(".block-recipes .link-open-recipe")
    links_open_recipe.forEach(function (link) {
        link.addEventListener("click", function() {
            // angeklicktes Rezept öffnen
            let parent = this.closest(".recipe-card")
            let recipe_name = parent.querySelector(".heading .label-text").textContent
            if (recipe_name) {
                let recipe_name_words = recipe_name.split(" ")
                recipe_name = recipe_name_words.join("_")
                // console.log("url Rezeptname", recipe_name)
                window.location.href=`../rezept/#/${encodeURIComponent(recipe_name)}`
            } else {
                console.error("Keinen Rezeptnamen gefunden, um die Rezeptseite zu öffnen!")
            }
        })
    })
}


set_db_variables()

function finished_db() {
    insert_search_information()
    insert_recipes_blocks()
    insert_recipe_card_information()
    add_recipe_link_event_listeners()
}


// TODO: evtl die erste recipe-row aus der Startseite importieren (wenn ich recipe-row auf der Startseite HTML bearbeite, dass diese Änderungen direkt übernommen werden)

// TODO: falls wir mal viele Rezepte haben nur eine bestimmte Anzahl anzeigen und einen Button einfügen, mit dem man weitere lädt