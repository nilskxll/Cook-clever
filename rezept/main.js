let minus_button = document.getElementById("minus-button")
let plus_button = document.getElementById("plus-button")
let number_of_portions = document.querySelector(".number-of-portions-frame .value")
let number_of_ingredients


minus_button.addEventListener("click", function() {change_number_of_portions("down")})
plus_button.addEventListener("click", function() {change_number_of_portions("up")})


// Anzahl der Portionen extrahieren
function extract_number_of_portions() {
    let text = number_of_portions.textContent
    let words = text.split(" ")
    return Number(words[0])
}

// Anzahl der Portionen ändern
function change_number_of_portions (direction) {
    let value = extract_number_of_portions()

    // Wert der Portionenzahl ändern (Beschränkung auf max. 99 hat keinen wirklichen Grund. Lässt man mehr zu, müsste der number of portions frame mit wachsen.)
    if (direction === "up") {
        if (value < 99) {
            value++
        }
    } else if (value > 1) {
        value--
    }

    // Wert mit "Portion" in Singular/Plural ausgeben
    if (value === 1) {
        number_of_portions.textContent = "1 Portion"
    } else {
        number_of_portions.textContent = `${value} Portionen`
    }
}

// Zutaten mit Namen und Werten einfügen
let test_list_names = ["Basikilum", "Eier", "Mehl"]
let test_list_values = [2, 6, "500 g"]
function insert_ingredients() {
    number_of_ingredients = test_list_names.length

    // Zutatenelemente im HTML klonen
    let ingredients_frame = document.querySelector(".ingredients-frame")
    let ingredient = document.querySelector(".ingredient")
    for (let i = 1; i < number_of_ingredients; i++) {
        let clone = ingredient.cloneNode(true)
        ingredients_frame.appendChild(clone)
    }

    // Namen und Werte der Zutaten einfügen
    let ingredients_list = Array.from(document.querySelectorAll(".ingredient"))
    for (let k = 0; k < number_of_ingredients; k++) {
        let ingredient_name = ingredients_list[k].querySelector(".name")
        let ingredient_value = ingredients_list[k].querySelector(".value")

        ingredient_name.textContent = test_list_names[k]
        ingredient_value.textContent = test_list_values[k]
    }
}
insert_ingredients()