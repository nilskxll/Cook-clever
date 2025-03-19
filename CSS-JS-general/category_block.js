let category_cards = Array.from(document.querySelectorAll(".category-cards"))
let category_block_link_icon_right = document.getElementById("category-block-link-icon-right")
let category_block_link_icon_left = document.getElementById("category-block-link-icon-left")
let vegan_button = document.getElementById("vegan-button")
let vegetarian_button = document.getElementById("vegetarian-button")
let meat_button = document.getElementById("meat-button")
let protein_rich_button = document.getElementById("protein-rich-button")
let low_calorie_button = document.getElementById("low-calorie-button")
let cheat_day_button = document.getElementById("cheat-day-button")

category_block_link_icon_right.addEventListener("click", move_category_block)
category_block_link_icon_left.addEventListener("click", move_category_block)
vegan_button.addEventListener("click", show_vegan_recipes)
vegetarian_button.addEventListener("click", show_vegetarian_recipes)
meat_button.addEventListener("click", show_meat_recipes)
protein_rich_button.addEventListener("click", show_protein_rich_recipes)
low_calorie_button.addEventListener("click", show_low_calorie_recipes)
cheat_day_button.addEventListener("click", show_cheat_day_recipes)


// angezeigte Kategorien wechseln, beim Klicken auf den Pfeil links bzw. rechts
function move_category_block() {
    // console.log("Kategorie swap gedrückt")
    // console.log("länge " + category_cards.length)
    // auf die zwei categorie-cards container die Klasse togglen
    for (let i = 0; i < category_cards.length; i++) {
        category_cards[i].classList.toggle("second-page")
    }
    // die Buttons rechte und links dazu- bzw. wegmachen
    if (category_cards[0].classList.contains("second-page")) {
        category_block_link_icon_right.style.opacity = "0"
        category_block_link_icon_left.style.visibility = ""
        category_block_link_icon_left.style.opacity = "1"
        // Timeout wegen der Dauer der Transition
        setTimeout(function () {
            category_block_link_icon_right.style.visibility = "hidden"
        }, 400)
    } else {
        category_block_link_icon_left.style.opacity = "0"
        category_block_link_icon_right.style.visibility = ""
        category_block_link_icon_right.style.opacity = "1"
        setTimeout(function () {
            category_block_link_icon_left.style.visibility = "hidden"
        }, 400)
    }

}

// auf Suchergebnisse-Seite wechseln mit den Rezepten der gewünschten Kategorie
function show_vegan_recipes() {
    // console.log("vegane Rezepte anzeigen")
    // console.log("IDs: " + vegane_Rezepte)
    sessionStorage.setItem("required_categories", JSON.stringify(["vegan"])) // Suchergebnisse-Seite braucht ein Array, da ja auch mehrere Kategorien angezeigt werden können.
    sessionStorage.setItem("required_nutrients", JSON.stringify([])) // Suchergebnisse-Seite wertet entweder einen Suchbegriff aus oder Kategorien und Nährwerte. Deshalb leeres Array, dass kein Fehler entsteht.
    sessionStorage.setItem("valid_IDs", JSON.stringify(vegane_Rezepte))
    window.location.href = "../suchergebnisse"
}

function show_vegetarian_recipes() {
    // console.log("vegetarische Rezepte anzeigen")
    // console.log("IDs: " + vegetarische_Rezepte)
    sessionStorage.setItem("required_categories", JSON.stringify(["vegetarisch", "vegan"]))
    sessionStorage.setItem("required_nutrients", JSON.stringify([]))
    sessionStorage.setItem("valid_IDs", JSON.stringify(vegetarische_Rezepte.concat(vegane_Rezepte))) // vegetarische und vegane Rezepte anzeigen
    window.location.href = "../suchergebnisse"
}

function show_meat_recipes() {
    // console.log("Rezepte mit Fleisch anzeigen")
    // console.log("IDs: " + Fleisch_Rezepte)
    sessionStorage.setItem("required_categories", JSON.stringify(["mit Fleisch"]))
    sessionStorage.setItem("required_nutrients", JSON.stringify([]))
    sessionStorage.setItem("valid_IDs", JSON.stringify(Fleisch_Rezepte))
    window.location.href = "../suchergebnisse"
}

function show_protein_rich_recipes() {
    // console.log("proteinreiche Rezepte anzeigen")
    // console.log("IDs: " + proteinreicheRezepte)
    sessionStorage.setItem("required_categories", JSON.stringify(["proteinreich"]))
    sessionStorage.setItem("required_nutrients", JSON.stringify([]))
    sessionStorage.setItem("valid_IDs", JSON.stringify(proteinreicheRezepte))
    window.location.href = "../suchergebnisse"
}

function show_low_calorie_recipes() {
    // console.log("kalorienarme Rezepte anzeigen")
    // console.log("IDs: " + kalorienarmeRezepte)
    sessionStorage.setItem("required_categories", JSON.stringify(["kalorienarm"]))
    sessionStorage.setItem("required_nutrients", JSON.stringify([]))
    sessionStorage.setItem("valid_IDs", JSON.stringify(kalorienarmeRezepte))
    window.location.href = "../suchergebnisse"
}

function show_cheat_day_recipes() {
    // console.log("vegane Rezepte anzeigen")
    // console.log("IDs: " + cheatmeals_Liste)
    sessionStorage.setItem("required_categories", JSON.stringify(["für den Cheat-Day"]))
    sessionStorage.setItem("required_nutrients", JSON.stringify([]))
    sessionStorage.setItem("valid_IDs", JSON.stringify(cheatmeals_Liste))
    window.location.href = "../suchergebnisse"
}