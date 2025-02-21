let category_block_1 = document.getElementById("category-block-1")
let category_block_2 = document.getElementById("category-block-2")
let category_block_link_icon_right = document.getElementById("category-block-link-icon-right")
let category_block_link_icon_left = document.getElementById("category-block-link-icon-left")

category_block_link_icon_right.addEventListener("click", swap_category_block)
category_block_link_icon_left.addEventListener("click", swap_category_block)


// angezeigte Kategorien wechseln, beim Klicken auf den Pfeil links bzw. rechts
function swap_category_block() {
    // console.log("Kategorie swap gedrückt")
    if (category_block_1.style.display === "") {
        category_block_1.style.display = "none"
        category_block_2.style.display = ""
    } else {
        category_block_2.style.display = "none"
        category_block_1.style.display = ""
    }
}