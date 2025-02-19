let kategorie_block_1 = document.getElementById("kategorie-block-1")
let kategorie_block_2 = document.getElementById("kategorie-block-2")
let kategorie_block_link_icon_rechts = document.getElementById("kategorie-block-link-icon-rechts")
let kategorie_block_link_icon_links = document.getElementById("kategorie-block-link-icon-links")

kategorie_block_link_icon_rechts.addEventListener("click", swap_kategorie_block)
kategorie_block_link_icon_links.addEventListener("click", swap_kategorie_block)


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