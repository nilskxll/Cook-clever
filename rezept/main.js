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
function insert_ingredients() {
    number_of_ingredients = 5
    let ingredients_frame = document.querySelector(".ingredients-frame")
    // mit 0 angefangen, dass man aus der ingredients list direkt mit index = i einfügen kann
    for (let i = 0; i < number_of_ingredients; i++) {
        // HTML Elemente erstellen
        /*<div className="ingredient">
            <div className="name-frame">
                <div className="name">Name der Zutat</div>
            </div>
            <div className="value-frame">
                <div className="value">Menge der Zutat mit Einheit</div>
            </div>
        </div>*/
        let ingredient = document.createElement("div")
        ingredient.classList.add("ingredient")

        let name_frame = document.createElement("div")
        name_frame.classList.add("name-frame")

        let name = document.createElement("div")
        name.classList.add("name")
        name.textContent = "Name der Zutat"

        let value_frame = document.createElement("div")
        value_frame.classList.add("value-frame")

        let value = document.createElement("div")
        value.classList.add("value")
        value.textContent = "Menge"

        // Elemente zusammenfügen und in ingredients_frame im HTML Dokument einfügen
        name_frame.appendChild(name)
        value_frame.appendChild(value)
        ingredient.appendChild(name_frame)
        ingredient.appendChild(value_frame)
        ingredients_frame.appendChild(ingredient)
    }
}



insert_ingredients()