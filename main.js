let Nährwerte
let Rezepte
let Einheiten
let Zutaten
let aktuelle_Nährwerte
let aktuelles_Rezept
let aktuelle_Einheiten
let aktuelle_Zutaten
let aktuelle_Kalorien
let aktuelle_Protein
let aktuelles_Fett
let aktuelle_Kohlenhydrate
let aktueller_zugesetzter_Zucker
let aktuelle_Ballaststoffe
let aktueller_Rezept_Name
let aktuelle_Anleitung
let aktuelle_Essgewohnheit
let aktuelle_Arbeitszeit
let aktuelle_Kochzeit
let aktuelle_Gesamtzeit
let Kochzeit_h
let Kochzeit_min
let Arbeitszeit_h
let Arbeitszeit_min
let Gesamtzeit_h
let Gesamtzeit_min

let button_Rezept1 = document.getElementById("ButtonRezept1")
button_Rezept1.addEventListener("click", function (){rezept_öffnen(1)})
let button_Rezept2 = document.getElementById("ButtonRezept2")
button_Rezept2.addEventListener("click", function (){rezept_öffnen(2)})
let button_Rezept3 = document.getElementById("ButtonRezept3")
button_Rezept3.addEventListener("click", function (){rezept_öffnen(3)})

function daten_aus_db() {
    fetch('cgi-bin/db_connection.php')
        .then(response => response.json())
        .then(daten => {
            //Daten aus der PHP Datei in die Matrizen einfügen, damit man in JS damit arbeiten kann
            Nährwerte = daten.naehrwerte;
            Rezepte = daten.rezepte;
            Einheiten = daten.einheiten;
            Zutaten = daten.zutaten;
        })
        .catch(error => { //Falls irgendwo nen Fehler auftritt, sieht man gleich über den error warum
            console.error("Fehler beim Abrufen der Daten:", error);
        });
}
/*
function ausführen() {
    // kann gelöscht werden, jedoch sieht man erstmal wie das dort in den einzelnen Variablen abgespeichert ist.
    document.getElementById("Nährwerte").innerText = JSON.stringify(Nährwerte)
    document.getElementById("Rezepte").innerText = JSON.stringify(Rezepte)
    document.getElementById("Einheiten").innerText = JSON.stringify(Einheiten)
    document.getElementById("Zutaten").innerText = JSON.stringify(Zutaten)
}
 */
function rezept_öffnen(aktuell){
    if (aktuell <= Rezepte.length){ //überprüfen ob Rezept überhaupt vorhanden (eventuell unnötig)

        aktuelle_Nährwerte = Nährwerte[aktuell - 1]
        aktuelles_Rezept = Rezepte[aktuell - 1]
        aktuelle_Zutaten = Rezepte[aktuell - 1]

        aktuelle_Kalorien = aktuelle_Nährwerte.Kalorien;
        aktuelle_Protein = aktuelle_Nährwerte.Protein;
        aktuelles_Fett = aktuelle_Nährwerte.Fett;
        aktuelle_Kohlenhydrate = aktuelle_Nährwerte.Kohlenhydrate;
        aktueller_zugesetzter_Zucker = aktuelle_Nährwerte.zugesetzer_Zucker;
        aktuelle_Ballaststoffe = aktuelle_Nährwerte.Ballaststoffe;

        aktueller_Rezept_Name = aktuelles_Rezept.Rezeptname;
        aktuelle_Anleitung = aktuelles_Rezept.Anleitung;
        aktuelle_Essgewohnheit = aktuelles_Rezept.Essgewohnheit;
        aktuelle_Arbeitszeit = aktuelles_Rezept.Arbeitszeit
        aktuelle_Kochzeit = aktuelles_Rezept.Kochzeit
        aktuelle_Gesamtzeit = aktuelle_Arbeitszeit + aktuelle_Kochzeit

        zeit_umrechnen()

        document.getElementById("Kalorien").innerText = aktuelle_Kalorien + "kcal Kohlenhydrate"
        document.getElementById("Kohlenhydrate").innerText = aktuelle_Kohlenhydrate + "g Kohlenhydrate"
        document.getElementById("Fett").innerText = aktuelles_Fett + "g Fett"
        document.getElementById("Protein").innerText = aktuelle_Protein + "g Protein"
        document.getElementById("zugesetzter_Zucker").innerText = aktueller_zugesetzter_Zucker + "g Zucker"
        document.getElementById("Ballaststoffe").innerText = aktuelle_Ballaststoffe + "g Ballaststoffe"
        document.getElementById("Rezept_Name").innerText = aktueller_Rezept_Name
        document.getElementById("Anleitung").innerText = aktuelle_Anleitung
        document.getElementById("Essgewohnheit").innerText = aktuelle_Essgewohnheit

        if (Arbeitszeit_h === 0){
            document.getElementById("Arbeitszeit").innerText = Arbeitszeit_min + "min"
        }
        else {
            if (Arbeitszeit_min === 0){
                document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h"
            }
            else {
                document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h " + Arbeitszeit_min + "min"
            }
        }
        if (Kochzeit_h === 0){
            document.getElementById("Kochzeit").innerText = Kochzeit_min + "min"
        }
        else{
            if (Kochzeit_min === 0){
                document.getElementById("Kochzeit").innerText = Kochzeit_h + "h"
            }
            else {
                document.getElementById("Kochzeit").innerText = Kochzeit_h + "h " + Kochzeit_min + "min"
            }
        }
        if (Gesamtzeit_h === 0){
            document.getElementById("Gesamtzeit").innerText = Gesamtzeit_min + "min"
        }
        else{
            if (Gesamtzeit_min === 0){
                document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h"
            }
            else {
                document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h " + Gesamtzeit_min + "min"
            }
        }
    }
    else{
        console.log("Fehler bei dem Rezept öffnen")
    }

}
/*setTimeout(function () { //hier muss eben alles rein, was früher als die Daten aus der Datenbank abgerufen wird, jedoch die Daten aus dieser Datenbank brauch.

        //rezept_öffnen(aktuell_geöffnetes_Rezept)
        //ausführen()
    },300
)*/

function zeit_umrechnen(){
    Arbeitszeit_h = Math.floor(aktuelle_Arbeitszeit / 60)
    Arbeitszeit_min = aktuelle_Arbeitszeit % 60

    Kochzeit_h = Math.floor(aktuelle_Kochzeit / 60)
    Kochzeit_min = aktuelle_Kochzeit % 60

    Gesamtzeit_h = Math.floor( aktuelle_Gesamtzeit / 60)
    Gesamtzeit_min = aktuelle_Gesamtzeit % 60
}
daten_aus_db()
