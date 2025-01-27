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
let aktuelle_Arbeitzeit
let aktuelle_Kochzeit
let aktuelle_Gesamtzeit

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
        aktuelle_Arbeitzeit = aktuelles_Rezept.Arbeitszeit
        aktuelle_Kochzeit = aktuelles_Rezept.Kochzeit
        aktuelle_Gesamtzeit = aktuelle_Arbeitzeit + aktuelle_Kochzeit

        document.getElementById("Kalorien").innerText = aktuelle_Kalorien
        document.getElementById("Kohlenhydrate").innerText = aktuelle_Kohlenhydrate
        document.getElementById("Fett").innerText = aktuelles_Fett
        document.getElementById("Protein").innerText = aktuelle_Protein
        document.getElementById("zugesetzter_Zucker").innerText = aktueller_zugesetzter_Zucker
        document.getElementById("Ballaststoffe").innerText = aktuelle_Ballaststoffe
        document.getElementById("Rezept_Name").innerText = aktueller_Rezept_Name
        document.getElementById("Anleitung").innerText = aktuelle_Anleitung
        document.getElementById("Essgewohnheit").innerText = aktuelle_Essgewohnheit
        document.getElementById("Arbeitszeit").innerText = aktuelle_Arbeitzeit
        document.getElementById("Kochzeit").innerText = aktuelle_Kochzeit
        document.getElementById("Gesamtzeit").innerText = aktuelle_Gesamtzeit

    }
    else{
        console.log("Fehler bei dem Rezept öffnen")
    }

}
daten_aus_db()
setTimeout(function () { //hier muss eben alles rein, was früher als die Daten aus der Datenbank abgerufen wird, jedoch die Daten aus dieser Datenbank brauch.

        //rezept_öffnen(aktuell_geöffnetes_Rezept)
        //ausführen()
    },300
)
