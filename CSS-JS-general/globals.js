let header_big = document.getElementById("header-big")
let header_small = document.getElementById("header-small")
let header_big_search_bar = document.getElementById("sucheingabe-header-big")
let header_small_search_bar = document.getElementById("sucheingabe-header-small")
let header_small_spacer = document.getElementById("header-small-spacer")
let label_about_us_big = document.getElementById("label-about-us-big")
let label_about_us_small = document.getElementById("label-about-us-small")
let search_bar_big = document.getElementById("sucheingabe-header-big")
let search_bar_small = document.getElementById("sucheingabe-header-small")

window.addEventListener("scroll", swap_header)
label_about_us_big.addEventListener("click", scroll_to_bottom)
label_about_us_small.addEventListener("click", scroll_to_bottom)
search_bar_big.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        suchFeld("sucheingabe-header-big")
    }
})
search_bar_small.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        suchFeld("sucheingabe-header-small")
    }
})

// beim Seite neu laden hochscrollen
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

// Header gross und klein beim Scrollen wechseln
function swap_header() {
    // console.log("scroll detect, position: " + window.scrollY)
    if (window.scrollY >= 50) {
        if (header_big.style.display === "") {
            header_big.style.display = "none"
            header_small.style.display = ""
            header_small_spacer.style.display = ""
            header_small_search_bar.value = header_big_search_bar.value
        }
    } else {
        if (header_big.style.display === "none") {
            header_big.style.display = ""
            header_small.style.display = "none"
            header_small_spacer.style.display = "none"
            header_big_search_bar.value = header_small_search_bar.value
        }
    }
}

// zum Footer scrollen, wenn man im Header auf About us klickt
function scroll_to_bottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight
    // console.log("about us gedrückt")
}

// wenn man im Suchfeld Enter drückt
function suchFeld(big_small_header) {
    let input = document.getElementById(big_small_header).value.toLowerCase(); // Eingabe aus dem HTML-Input holen
    let Rezepte_Suchanfrage_Liste_ID = []; // Liste für gefilterte Rezept-IDs

    for (let i = 0; i < Rezepte.length; i++) {
        let rezeptName = Rezepte[i].Rezeptname.toLowerCase(); // Rezeptname in Kleinbuchstaben umwandeln

        if (rezeptName.includes(input)) { // Prüfen, ob die Eingabe ein Teil des Namens ist
            Rezepte_Suchanfrage_Liste_ID.push(Rezepte[i].Rezept_ID); // Passende Rezept-ID speichern
        }
    }
    // console.log(Rezepte_Suchanfrage_Liste_ID); // Testausgabe der gefundenen Rezept-IDs
    sessionStorage.setItem("valid_IDs", JSON.stringify(Rezepte_Suchanfrage_Liste_ID)) // sessionStorage, dann Werte an Suchergebnisse-Seite übergeben werden können
    window.location.href = "../suchergebnisse"
}