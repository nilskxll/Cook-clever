let header_big = document.getElementById("header-big")
let header_small = document.getElementById("header-small")
let header_small_spacer = document.getElementById("header-small-spacer")
let kategorie_block_1 = document.getElementById("kategorie-block-1")
let kategorie_block_2 = document.getElementById("kategorie-block-2")
let kategorie_block_link_icon_rechts = document.getElementById("kategorie-block-link-icon-rechts")
let kategorie_block_link_icon_links = document.getElementById("kategorie-block-link-icon-links")

window.addEventListener("scroll", swap_header)
kategorie_block_link_icon_rechts.addEventListener("click", swap_kategorie_block)
kategorie_block_link_icon_links.addEventListener("click", swap_kategorie_block)

//beim Seite neu laden hochscrollen
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function swap_header() {
    //console.log("scroll detect: " + window.scrollY)
    if (window.scrollY >= 50) {
        if (header_big.style.display === "") {
            header_big.style.display = "none"
            header_small.style.display = ""
            header_small_spacer.style.display = ""
        }
    } else {
        if (header_big.style.display === "none") {
            header_big.style.display = ""
            header_small.style.display = "none"
            header_small_spacer.style.display = "none"
        }
    }
}

function swap_kategorie_block() {
    console.log("Kategorie swap gedrückt")
    if (kategorie_block_1.style.display === "") {
        kategorie_block_1.style.display = "none"
        kategorie_block_2.style.display = ""
    } else {
        kategorie_block_2.style.display = "none"
        kategorie_block_1.style.display = ""
    }
}