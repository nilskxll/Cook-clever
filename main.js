let Nährwerte
let Rezepte
let Einheiten
let Zutaten
let aktuell_geöffnetes_Rezept = 3 //wird durch Klicken auf rezept dan definiert
let aktuelle_Nährwerte
let aktuelles_Rezept
let aktuelle_Einheiten
let aktuelle_Zutaten
let aktuelle_Kalorien
let aktuelle_Protein
let aktuelles_Fett
let aktuelle_Kohlenhydrate
let aktueller_zugesetzter_Zucken
let aktuelle_Ballaststoffe
function daten_aus_db() {
    fetch('cgi-bin/db_connection.php')
        .then(response => response.json())
        .then(daten => {
            Nährwerte = daten.naehrwerte;
            Rezepte = daten.rezepte;
            Einheiten = daten.einheiten;
            Zutaten = daten.zutaten;
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Daten:", error);
        });
}

function ausführen() {
    // kann gelöscht werden, jedoch sieht man erstmal wie das dort in den einzelnen Variablen abgespeichert ist.
    document.getElementById("Nährwerte").innerText = JSON.stringify(Nährwerte)
    document.getElementById("Rezepte").innerText = JSON.stringify(Rezepte)
    document.getElementById("Einheiten").innerText = JSON.stringify(Einheiten)
    document.getElementById("Zutaten").innerText = JSON.stringify(Zutaten)
}
function rezept_öffnen(aktuell){
    if (aktuell <= Rezepte.length){ //überprüfen ob Rezept überhaupt vorhanden (eventuell unnötig)
        aktuelle_Nährwerte= Nährwerte[aktuell - 1]
        aktuelle_Kalorien = aktuelle_Nährwerte.Kalorien;
        aktuelle_Protein = aktuelle_Nährwerte.Protein;
        aktuelles_Fett = aktuelle_Nährwerte.Fett;
        aktuelle_Kohlenhydrate = aktuelle_Nährwerte.Kohlenhydrate;
        aktueller_zugesetzter_Zucken = aktuelle_Nährwerte.zugesetzer_Zucker;
        aktuelle_Ballaststoffe = aktuelle_Nährwerte.Ballaststoffe;

        // Optional: Alles als Liste darstellen (nur zum test) (Dadurch leichter mit einmal auszugeben)
        let liste = [
            aktuelle_Kalorien,
            aktuelle_Protein,
            aktuelles_Fett,
            aktuelle_Kohlenhydrate,
            aktueller_zugesetzter_Zucken,
            aktuelle_Ballaststoffe,
        ];
        console.log("Rezept " + aktuell_geöffnetes_Rezept +":", liste);
        console.log(liste[2] + " Fett")
    }
    else{
        console.log("Fehler bei dem Rezept öffnen")
    }

}
daten_aus_db()
setTimeout(function () {


        rezept_öffnen(aktuell_geöffnetes_Rezept)
        ausführen()
    },100
)
