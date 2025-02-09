let Nährwerte
let Rezepte
let Einheiten
let Zutaten
let aktuelle_Nährwerte
let aktuelles_Rezept
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
let zutatenListe = []
let mengenListe = []
let einheitenListe = []
let zutat
let zutatenText
let mengenListe_plus_portionen
let portionen = 1
let aktuelle_Kalorien_plus_portionen
let aktuelle_Protein_plus_portionen
let aktuelles_Fett_plus_portionen
let aktuelle_Kohlenhydrate_plus_portionen
let aktueller_zugesetzter_Zucker_plus_portionen
let aktuelle_Ballaststoffe_plus_portionen
let cheatmeals_Liste = []
let kalorienarmeRezepte = []
let proteinreicheRezepte = []
let vegetarische_Rezepte = []
let vegane_Rezepte = []
let Fleisch_Rezepte = []

let button_Rezept1 = document.getElementById("ButtonRezept1")
button_Rezept1.addEventListener("click", function (){aktuelles_Rezept_Werte_zuweisen(1)})
let button_Rezept2 = document.getElementById("ButtonRezept2")
button_Rezept2.addEventListener("click", function (){aktuelles_Rezept_Werte_zuweisen(2)})
let button_Rezept3 = document.getElementById("ButtonRezept3")
button_Rezept3.addEventListener("click", function (){aktuelles_Rezept_Werte_zuweisen(3)})

let button_Portionen = document.getElementById("button_Portionen");

button_Portionen.addEventListener("click", function() {
    portionen = document.getElementById("Portionen").value; // Der Wert des input-Feldes
    portionenRechner(portionen)
})

function daten_aus_db() {
    fetch('cgi-bin/db_connection.php')
        .then(response => response.json())
        .then(daten => {
            //Daten aus der PHP Datei in die Matrizen einfügen, damit man in JS damit arbeiten kann
            Nährwerte = daten.naehrwerte
            Rezepte = daten.rezepte
            Einheiten = daten.einheiten
            Zutaten = daten.zutaten
            einkategorisieren()
        })
        .catch(error => { //Falls irgendwo nen Fehler auftritt, sieht man gleich über den error warum
            console.error("Fehler beim Abrufen der Daten:", error)
        })
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

function einkategorisieren (){
    for ( i = 0; Nährwerte[i]; i++) {
        let Rezept_überprüfung = Nährwerte[i]
        if (Rezept_überprüfung.Kalorien >= 350) {               //Hier kann man einstellen, ab wann es eben zu den cheatmeals gehört
            cheatmeals_Liste.push(Rezept_überprüfung.Rezept_ID)
        }
        if(Rezept_überprüfung.Kalorien <= 300) {                //Hier kann man einstellen, ab wann es eben zu den Kalorienarmen gehört
            kalorienarmeRezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Protein >= 9){                   //Hier kann man einstellen, ab wann es eben zu den Eiweiß reichen Rezepten gehört
            proteinreicheRezepte.push(Rezept_überprüfung.Rezept_ID)
        }
    }
    for (i = 0; Rezepte[i]; i++){
        Rezept_überprüfung = Rezepte[i]
        if (Rezept_überprüfung.Essgewohnheit = "vegetarisch"){
            vegetarische_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit = "vegan"){
            vegane_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit = "mit Fleisch"){
            Fleisch_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
    }
}

function aktuelles_Rezept_Werte_zuweisen(aktuell){
    if (aktuell <= Rezepte.length){ //überprüfen ob Rezept überhaupt vorhanden (eventuell unnötig)
        portionen = 1
        aktuelle_Nährwerte = Nährwerte[aktuell - 1]
        aktuelles_Rezept = Rezepte[aktuell - 1]
        aktuelle_Zutaten = Zutaten[aktuell - 1]

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

        Zutaten_in_Listen_umwandeln()
        zeit_umrechnen()
        Werte_Rezept_ausgeben_Nährwerte()
        Werte_Rezept_ausgeben_Beschreibung()
        Werte_Rezept_ausgeben_Zeit()
        Zutaten_ausgeben()

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

function Zutaten_in_Listen_umwandeln(){
    zutatenListe.length = 0
    mengenListe.length = 0
    einheitenListe.length = 0
    for (zutat in aktuelle_Zutaten){
        let menge = aktuelle_Zutaten[zutat]

        if (menge !== null && zutat !== "Rezept_ID"){
            zutatenListe.push(zutat)
            mengenListe.push(menge)
            let einheit_Objekte = Einheiten.find(Objekt_Zutat => Objekt_Zutat.Zutat === zutat); // da Einheiten eine Liste mit Objekten ist, muss dort die aktuelle zutat in den Objekten gesucht werden (find)
            einheitenListe.push(einheit_Objekte ? einheit_Objekte.Einheit : ""); // Falls keine Einheit gefunden wird, bleibt es leer
            }
    }
}

function zeit_umrechnen(){
    Arbeitszeit_h = Math.floor(aktuelle_Arbeitszeit / 60)
    Arbeitszeit_min = aktuelle_Arbeitszeit % 60

    Kochzeit_h = Math.floor(aktuelle_Kochzeit / 60)
    Kochzeit_min = aktuelle_Kochzeit % 60

    Gesamtzeit_h = Math.floor( aktuelle_Gesamtzeit / 60)
    Gesamtzeit_min = aktuelle_Gesamtzeit % 60
}

function Werte_Rezept_ausgeben_Nährwerte() {
    if (portionen === 1) {
        document.getElementById("Kalorien").innerText = aktuelle_Kalorien + "kcal"
        document.getElementById("Kohlenhydrate").innerText = aktuelle_Kohlenhydrate + "g Kohlenhydrate"
        document.getElementById("Fett").innerText = aktuelles_Fett + "g Fett"
        document.getElementById("Protein").innerText = aktuelle_Protein + "g Protein"
        document.getElementById("zugesetzter_Zucker").innerText = aktueller_zugesetzter_Zucker + "g Zucker"
        document.getElementById("Ballaststoffe").innerText = aktuelle_Ballaststoffe + "g Ballaststoffe"
    }
    else{
        document.getElementById("Kalorien").innerText = aktuelle_Kalorien_plus_portionen + "kcal"
        document.getElementById("Kohlenhydrate").innerText = aktuelle_Kohlenhydrate_plus_portionen + "g Kohlenhydrate"
        document.getElementById("Fett").innerText = aktuelles_Fett_plus_portionen + "g Fett"
        document.getElementById("Protein").innerText = aktuelle_Protein_plus_portionen + "g Protein"
        document.getElementById("zugesetzter_Zucker").innerText = aktueller_zugesetzter_Zucker_plus_portionen + "g Zucker"
        document.getElementById("Ballaststoffe").innerText = aktuelle_Ballaststoffe_plus_portionen + "g Ballaststoffe"
    }
}

function Werte_Rezept_ausgeben_Beschreibung(){
    document.getElementById("Rezept_Name").innerText = aktueller_Rezept_Name
    document.getElementById("Anleitung").innerText = aktuelle_Anleitung
    document.getElementById("Essgewohnheit").innerText = aktuelle_Essgewohnheit
}

function Werte_Rezept_ausgeben_Zeit(){
    if (Arbeitszeit_h === 0) {
        document.getElementById("Arbeitszeit").innerText = Arbeitszeit_min + "min"
    } else {
        if (Arbeitszeit_min === 0) {
            document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h"
        } else {
            document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h " + Arbeitszeit_min + "min"
        }
    }
    if (Kochzeit_h === 0) {
        document.getElementById("Kochzeit").innerText = Kochzeit_min + "min"
    } else {
        if (Kochzeit_min === 0) {
            document.getElementById("Kochzeit").innerText = Kochzeit_h + "h"
        } else {
            document.getElementById("Kochzeit").innerText = Kochzeit_h + "h " + Kochzeit_min + "min"
        }
    }
    if (Gesamtzeit_h === 0) {
        document.getElementById("Gesamtzeit").innerText = Gesamtzeit_min + "min"
    } else {
        if (Gesamtzeit_min === 0) {
            document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h"
        } else {
            document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h " + Gesamtzeit_min + "min"
        }
    }
}

function Zutaten_ausgeben(){
    zutatenText = ""
    if (portionen === 1){
        for (i = 0; i < mengenListe.length; i++){
            if (mengenListe[i] === 0){
                zutatenText += zutatenListe[i] + "\n";
            }
            else {
                zutatenText += mengenListe[i] + einheitenListe[i] + " " + zutatenListe[i] + "\n";
            }
        }
        document.getElementById("Zutaten").innerText = zutatenText;
    }
    else {
        for (i = 0; i < mengenListe_plus_portionen.length; i++){
            if (mengenListe_plus_portionen[i] === 0){
                zutatenText += zutatenListe[i] + "\n";
            }
            else {
                zutatenText += mengenListe_plus_portionen[i] + einheitenListe[i] + " " + zutatenListe[i] + "\n";
            }
        }
        document.getElementById("Zutaten").innerText = zutatenText;
    }

}

function portionenRechner(Portionen){
    if(mengenListe.length === 0) {
        Zutaten_in_Listen_umwandeln()
    }
    mengenListe_plus_portionen = mengenListe.map(menge => menge * Portionen)
    aktuelle_Kalorien_plus_portionen = aktuelle_Kalorien * Portionen
    aktuelle_Protein_plus_portionen = aktuelle_Protein * Portionen
    aktuelles_Fett_plus_portionen = aktuelles_Fett * Portionen
    aktuelle_Kohlenhydrate_plus_portionen = aktuelle_Kohlenhydrate * Portionen
    aktueller_zugesetzter_Zucker_plus_portionen = aktueller_zugesetzter_Zucker * Portionen
    aktuelle_Ballaststoffe_plus_portionen = aktuelle_Ballaststoffe * Portionen
    Werte_Rezept_ausgeben_Nährwerte()
    Zutaten_ausgeben()
}

function Rezeptefidner (){
    //Hier wird dann der RF gebaut. Mein Plan ist, nach dem Alle bedingungen gelegt wurden, halt mit den Jeweiligen Bedingungen Listen zu erstellen, welche Rezepte dazu passen. Wenn dann eben sich eine Rezept_ID in allen Listen =>
    //überschneidet, ist es eins der gesuchten Rezepte.
}

function suchFeld(){
    //hier soll eben dann eine Listen mit allen Namen der Rezepte erschaffen werden, dann mal schauen wie, aber wenn User dann was in das Feld eingibt, sollen Vorschläge kommen, auf die man draufklicken kann, dann wird eben genau das Rezept gesucht
}
daten_aus_db()
