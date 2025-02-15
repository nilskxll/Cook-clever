/*let checkbox_energie = document.getElementById("checkbox-energie")
let checkbox_eiweiss = document.getElementById("checkbox-eiweiss")
let checkbox_fett = document.getElementById("checkbox-fett")
let checkbox_kohlenhydrate = document.getElementById("checkbox-kohlenhydrate")
let checkbox_zuges_zucker = document.getElementById("checkbox-zuges-zucker")
let checkbox_ballaststoffe = document.getElementById("checkbox-ballaststoffe")*/
let checkbox_vegan = document.getElementById("checkbox-vegan")
let checkbox_vegetarisch = document.getElementById("checkbox-vegetarisch")
let checkbox_mit_fleisch = document.getElementById("checkbox-mit-fleisch")
let checkbox_proteinreich = document.getElementById("checkbox-proteinreich")
let checkbox_kalorienarm = document.getElementById("checkbox-kalorienarm")
let checkbox_fuer_den_cheat_day = document.getElementById("checkbox-fuer-den-cheat-day")
let checkboxes_categories = [checkbox_vegan, checkbox_vegetarisch, checkbox_mit_fleisch, checkbox_proteinreich, checkbox_kalorienarm, checkbox_fuer_den_cheat_day]
let show_results_button = document.getElementById("show-results-button")


/*checkbox_energie.addEventListener("click", function () {checkbox_click("energie")})
checkbox_eiweiss.addEventListener("click", function () {checkbox_click("eiweiss")})
checkbox_fett.addEventListener("click", function () {checkbox_click("fett")})
checkbox_kohlenhydrate.addEventListener("click", function () {checkbox_click("kohlenhydrate")})
checkbox_zuges_zucker.addEventListener("click", function () {checkbox_click("zuges-zucker")})
checkbox_ballaststoffe.addEventListener("click", function () {checkbox_click("ballaststoffe")})
checkbox_vegan.addEventListener("click", function () {checkbox_click("vegan")})
checkbox_vegetarisch.addEventListener("click", function () {checkbox_click("vegetarisch")})
checkbox_mit_fleisch.addEventListener("click", function () {checkbox_click("mit-fleisch")})
checkbox_proteinreich.addEventListener("click", function () {checkbox_click("proteinreich")})
checkbox_kalorienarm.addEventListener("click", function () {checkbox_click("kalorienarm")})
checkbox_fuer_den_cheat_day.addEventListener("click", function () {checkbox_click("fuer-den-cheat-day")})*/
show_results_button.addEventListener("click", show_results)


// TODO: wird diese Funktion gebraucht???
function checkbox_click(box) {
    console.log("check")
    console.log(this)
}

// Klick auf die Checkboxen der Nährwerte pro Portion
/* alle Elemente der Klassenkombination ".naehrwertangaben .checkbox" auswählen, folgendes für jedes der Elemente ausführen:
   wenn die ausgewählte checkbox geklickt wird, werden der dazugehörige value-frame und toggle-switch-text-box angezeigt bzw. versteckt
   um nicht endlos IDs zu vergeben, geht es so mit den Klassen einfacher (mit closest und so)
*/
document.querySelectorAll(".naehrwertangaben .checkbox").forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {

        let parent = this.closest(".naehrwert-suchangabe")
        let value_frame = parent.querySelector(".value-frame")
        let toggle_switch = parent.querySelector(".toggle-switch-text-box")

        // visibility, dass bei hidden nicht geklickt werden kann
        // opacity für die transition
        if (this.checked) {
            value_frame.style.visibility="visible"
            toggle_switch.style.visibility="visible"
            value_frame.style.opacity="1"
            toggle_switch.style.opacity="1"
        } else {
            value_frame.style.opacity="0"
            toggle_switch.style.opacity="0"
            setTimeout(function () {
                value_frame.style.visibility="hidden"
                toggle_switch.style.visibility="hidden"
            }, 300)
        }
    })
})

// Klick auf die toggle-switches der Nährwerte pro Portion
/* alle Elemente der Klasse ".toggle-switch" auswählen, folgendes für jedes der Elemente ausführen:
   click-EventListener hinzufügen, der bei Auslösung die Klasse ".active" auf das aktuelle Element hinzufügt bzw. entfernt
 */
document.querySelectorAll(".toggle-switch").forEach(function (aktueller_switch) {
    aktueller_switch.addEventListener("click", function () {
        aktueller_switch.classList.toggle("active");

        let parent = this.closest(".toggle-switch-text-box")
        let min_max = parent.querySelector(".text-wrapper-2")

        setTimeout(function () {
            if (min_max.textContent === "min.") {
                min_max.textContent = "max."
            } else {
                min_max.textContent = "min."
            }
        },150)
    });
});

// Idee zum Abfragen, nach welchen Kategorien gesucht werden soll
function show_results () {
    let required_categories = []
    for (const i in checkboxes_categories) {
        if (checkboxes_categories[i].checked) {
            required_categories.push(checkboxes_categories[i].id)
        }
    }
    console.log("suche nach kategorien: " + required_categories)
}

let a = ""
let b = ""