let header_big = document.getElementById("header-big")
let header_small = document.getElementById("header-small")
let header_big_search_bar = document.getElementById("sucheingabe-header-big")
let header_small_search_bar = document.getElementById("sucheingabe-header-small")
let header_small_spacer = document.getElementById("header-small-spacer")
let label_about_us_big = document.getElementById("label-about-us-big")
let label_about_us_small = document.getElementById("label-about-us-small")
let kategorie_block_1 = document.getElementById("kategorie-block-1")
let kategorie_block_2 = document.getElementById("kategorie-block-2")
let kategorie_block_link_icon_rechts = document.getElementById("kategorie-block-link-icon-rechts")
let kategorie_block_link_icon_links = document.getElementById("kategorie-block-link-icon-links")

window.addEventListener("scroll", swap_header)
label_about_us_big.addEventListener("click", scroll_to_bottom)
label_about_us_small.addEventListener("click", scroll_to_bottom)
kategorie_block_link_icon_rechts.addEventListener("click", swap_kategorie_block)
kategorie_block_link_icon_links.addEventListener("click", swap_kategorie_block)


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
    console.log("about us gedrückt")
}

// angezeigte Kategorien wechseln, beim Klicken auf den Pfeil links bzw. rechts
function swap_kategorie_block() {
    // console.log("Kategorie swap gedrückt")
    if (kategorie_block_1.style.display === "") {
        kategorie_block_1.style.display = "none"
        kategorie_block_2.style.display = ""
    } else {
        kategorie_block_2.style.display = "none"
        kategorie_block_1.style.display = ""
    }
}