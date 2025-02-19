let minus_button = document.getElementById("minus-button")
let plus_button = document.getElementById("plus-button")
let number_of_portions = document.querySelector(".number-of-portions-frame .value")


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

    // Wert der Portionenzahl ändern
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

// TODO: ausporbieren, wie man eine gewünschte Anzahl an Zutaten durch JS in HTML hinzufügen kann