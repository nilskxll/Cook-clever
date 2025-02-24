let category_cards = document.querySelector(".category-cards")
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
    category_cards.classList.toggle("second-page")
    if (category_cards.classList.contains("second-page")) {
        category_block_link_icon_right.style.opacity = "0"
        category_block_link_icon_left.style.visibility = ""
        category_block_link_icon_left.style.opacity = "1"
        setTimeout(function() {
            category_block_link_icon_right.style.visibility = "hidden"
        }, 400)
    } else {
        category_block_link_icon_left.style.opacity = "0"
        category_block_link_icon_right.style.visibility = ""
        category_block_link_icon_right.style.opacity = "1"
        setTimeout(function() {
            category_block_link_icon_left.style.visibility = "hidden"
        }, 400)
    }
    /*if (category_block_1.style.display === "") {
        category_block_1.style.display = "none"
        category_block_2.style.display = ""
    } else {
        category_block_2.style.display = "none"
        category_block_1.style.display = ""
    }*/
}

// auf Suchergebnisse-Seite wechseln mit den Rezepten der gewünschten Kategorie
function show_vegan_recipes() {
    // console.log("vegane Rezepte anzeigen")
    // console.log("IDs: " + window.vegane_Rezepte)
    sessionStorage.setItem("valid_IDs", window.vegane_Rezepte)
    window.location.href = "../suchergebnisse"
}

function show_vegetarian_recipes() {
    // console.log("vegetarische Rezepte anzeigen")
    // console.log("IDs: " + window.vegetarische_Rezepte)
    sessionStorage.setItem("valid_IDs", window.vegetarische_Rezepte)
    window.location.href = "../suchergebnisse"
}

function show_meat_recipes() {
    // console.log("Rezepte mit Fleisch anzeigen")
    // console.log("IDs: " + window.Fleisch_Rezepte)
    sessionStorage.setItem("valid_IDs", window.Fleisch_Rezepte)
    window.location.href = "../suchergebnisse"
}

function show_protein_rich_recipes() {
    // console.log("proteinreiche Rezepte anzeigen")
    // console.log("IDs: " + window.proteinreicheRezepte)
    sessionStorage.setItem("valid_IDs", window.proteinreicheRezepte)
    window.location.href = "../suchergebnisse"
}

function show_low_calorie_recipes() {
    // console.log("kalorienarme Rezepte anzeigen")
    // console.log("IDs: " + window.kalorienarmeRezepte)
    sessionStorage.setItem("valid_IDs", window.kalorienarmeRezepte)
    window.location.href = "../suchergebnisse"
}

function show_cheat_day_recipes() {
    // console.log("vegane Rezepte anzeigen")
    // console.log("IDs: " + window.cheatmeals_Liste)
    sessionStorage.setItem("valid_IDs", window.cheatmeals_Liste)
    window.location.href = "../suchergebnisse"
}

// TODO: vlt Kategorieblöcke in einen zusammenfassen, dass man eine schöne Animation machen kann
// TODO: sollten alle veganen Rezepte auch als vegetarisch einkategorisiert werden?