let Nährwerte, Rezepte, Einheiten, Zutaten //Sind Matrizen die alle informationen der DB enthalten
let aktuelle_Nährwerte, aktuelle_Zutaten, aktuelles_Rezept // ist das aktuelle Rezept welches ausgewählt ist. Sozusagen dann eine Liste mit eben allen Informationen zu diesem einen konkreten rezept. So zu sagen jedes von denen hat dann eine Zeile der Tabelle aus der Db (da mehrere Tabellen, werden auch mehrere Variablen benötigt
let aktuelle_Protein, aktuelles_Fett, aktuelle_Kohlenhydrate, aktueller_zugesetzter_Zucker, aktuelle_Ballaststoffe // werden aus den Nährwerten die einzelnen Werte gespeichert für aktuelles Rezept
let aktueller_Rezept_Name, aktuelle_Anleitung, aktuelle_Essgewohnheit // werden die grundlegenden Informationen des Rezeptes ausgegeben
let aktuelle_Arbeitszeit, aktuelle_Kochzeit, aktuelle_Gesamtzeit // Wird die Zeit für das aktuell ausgewählte Rezept gespeichert
let Kochzeit_h, Kochzeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let Arbeitszeit_h, Arbeitszeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let Gesamtzeit_h, Gesamtzeit_min //geteilt in einmal Minuten und Stunden (je nach dem was vorhanden)
let zutatenListe = [], mengenListe = [], einheitenListe = [] //
let zutat // ist wie i in der dann verwendeten for-schleife. So aber verständlicher mit dem Namen
let mengenListe_plus_portionen // einfach die Liste, in der die Mengenangaben multipliziert stehen (im Vergleich zu der mengenListe wo nur für eine Person gerechnet ist)
let portionen = 1 // Anzahl aktuell ausgewählter Portionen
let cheatmeals_Liste = [], kalorienarmeRezepte = [], proteinreicheRezepte = [], vegetarische_Rezepte = [], vegane_Rezepte = [], Fleisch_Rezepte = [] // Sind Listen in den die Rezept_ID der jeweiligen Rezepte gespeichert werden, in welche Kategorie sie eben gerade passen


//abhören der Buttons aus HTML (ist nur bis Lukas fertig ist)
let button_Rezept1 = document.getElementById("ButtonRezept1")
button_Rezept1.addEventListener("click", function (){aktuelles_Rezept_Werte_zuweisen(1)})
let button_Rezept2 = document.getElementById("ButtonRezept2")
button_Rezept2.addEventListener("click", function (){aktuelles_Rezept_Werte_zuweisen(2)})
let button_Rezept3 = document.getElementById("ButtonRezept3")
button_Rezept3.addEventListener("click", function (){aktuelles_Rezept_Werte_zuweisen(3)})

// wie das grob mit so nem Input Feld funktioniert (nur kopiert)
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

function einkategorisieren (){ // hier wird jeweils ein Objekt (eine Reihe von einem Rezept mit bestimmter ID überprüft, ob sie bestimmte Voraussetzungen hat. Wenn ja, wird sie mit der Rezept_ID hinzugefügt. Falls nein passiert nichts. (alles nur im Hintergrund)
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
        if (Rezept_überprüfung.Essgewohnheit === "vegetarisch"){
            vegetarische_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit === "vegan"){
            vegane_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
        if (Rezept_überprüfung.Essgewohnheit === "mit Fleisch"){
            Fleisch_Rezepte.push(Rezept_überprüfung.Rezept_ID)
        }
    }
}

function aktuelles_Rezept_Werte_zuweisen(aktuell){ //ausgewähltes Rezept (mit variable "aktuell" übergeben, wird in die einzelnen Variablen definiert, um diese dann in folgenden Schritten aufrufen zu können
    if (aktuell <= Rezepte.length){ //überprüfen ob Rezept überhaupt vorhanden (eventuell unnötig)
        portionen = 1 // Immer wenn neues Rezept aufgerufen wird, ist es Standardmäßig auf einer Portion
        aktuelle_Nährwerte = Nährwerte[aktuell - 1] // Wir bei 1 anfangen und Computer bei 0 deshalb minus 1. Allgemein wird in den Zeilen einfach nur eine Zeile (mit Rezept_ID === aktuell) den jeweiligen Listen zugewiesen
        aktuelles_Rezept = Rezepte[aktuell - 1]
        aktuelle_Zutaten = Zutaten[aktuell - 1]

        aktuelle_Kalorien = aktuelle_Nährwerte.Kalorien // in den folgenden Zeilen wird dann aus der eben Definierten Liste, verschiedene Objekte definiert (damit besser abrufbar)
        aktuelle_Protein = aktuelle_Nährwerte.Protein
        aktuelles_Fett = aktuelle_Nährwerte.Fett
        aktuelle_Kohlenhydrate = aktuelle_Nährwerte.Kohlenhydrate
        aktueller_zugesetzter_Zucker = aktuelle_Nährwerte.zugesetzer_Zucker
        aktuelle_Ballaststoffe = aktuelle_Nährwerte.Ballaststoffe

        aktueller_Rezept_Name = aktuelles_Rezept.Rezeptname // gleiche wie bei den Nährwerten auch bei den allgemeinen Informationen zu dem Rezept
        aktuelle_Anleitung = aktuelles_Rezept.Anleitung
        aktuelle_Essgewohnheit = aktuelles_Rezept.Essgewohnheit

        aktuelle_Arbeitszeit = aktuelles_Rezept.Arbeitszeit // gleiche wie bei den Nährwerten und den allgemeinen Informationen zu dem Rezept auch hier bei den Zeiten zu dem Rezept
        aktuelle_Kochzeit = aktuelles_Rezept.Kochzeit
        aktuelle_Gesamtzeit = aktuelle_Arbeitszeit + aktuelle_Kochzeit

        //danach werden alle Funktionen aufgerufen, die die definierten Variablen ausgeben
        Zutaten_in_Listen_umwandeln()
        zeit_umrechnen()
        Werte_Rezept_ausgeben_Nährwerte()
        Werte_Rezept_ausgeben_Beschreibung()
        Werte_Rezept_ausgeben_Zeit()
        Zutaten_ausgeben()
    }
    else{ //falls etwas falsch läuft, sie man beim Programmieren aus welchem Grund/ an welcher Stelle aktuell der Fehler aufgetreten ist
        console.log("Fehler bei dem Rezept öffnen")
    }
}

function Zutaten_in_Listen_umwandeln(){
    zutatenListe.length = 0 //wichtig das die Listen sobald man von einem rezept aufs nächste klickt auch die Listen wieder leer sind
    mengenListe.length = 0
    einheitenListe.length = 0
    for (zutat in aktuelle_Zutaten){ // jede Zutat wird einmal durchgegangen
        let menge = aktuelle_Zutaten[zutat] // die menge ( wie viel von einer Zutat) wird gespeichert in "menge")

        if (menge !== null && zutat !== "Rezept_ID"){ // wenn die menge dann "Null" ist, dann ist diese Zutat nicht in diesem Rezept vorhanden (nur in anderen) und wird herausgefiltert. Natürlich Rezept_ID auch keine Zutat, deshalb auch rausgefiltert.
            zutatenListe.push(zutat) // falls aber alles passt wird es in die Listen hinein gepushed (in richtiger Reihenfolge (Also wie in DB und nicht Alphabetisch (macht für uns keinen Unterschied))
            mengenListe.push(menge) //das gleiche mit der Menge
            let einheit_Objekte = Einheiten.find(Objekt_Zutat => Objekt_Zutat.Zutat === zutat); // da Einheiten eine Liste mit Objekten ist, muss dort die aktuelle zutat in den Objekten gesucht werden (find)
            einheitenListe.push(einheit_Objekte ? einheit_Objekte.Einheit : ""); // Falls keine Einheit gefunden wird, bleibt es leer
            }
    }
}

function zeit_umrechnen(){ //hier wird einfach nur die Zeit, falls sie über 60min ist umgerechnet in h und der rest bleibt in Minuten (wird aber auch mit ausgegeben)
    Arbeitszeit_h = Math.floor(aktuelle_Arbeitszeit / 60)
    Arbeitszeit_min = aktuelle_Arbeitszeit % 60

    Kochzeit_h = Math.floor(aktuelle_Kochzeit / 60)
    Kochzeit_min = aktuelle_Kochzeit % 60

    Gesamtzeit_h = Math.floor( aktuelle_Gesamtzeit / 60)
    Gesamtzeit_min = aktuelle_Gesamtzeit % 60
}

function Werte_Rezept_ausgeben_Nährwerte() {//die definierten JS Variablen werden einfach in eine Variable in HTML gepackt
        document.getElementById("Kalorien").innerText = aktuelle_Kalorien + "kcal"
        document.getElementById("Kohlenhydrate").innerText = aktuelle_Kohlenhydrate + "g Kohlenhydrate"
        document.getElementById("Fett").innerText = aktuelles_Fett + "g Fett"
        document.getElementById("Protein").innerText = aktuelle_Protein + "g Protein"
        document.getElementById("zugesetzter_Zucker").innerText = aktueller_zugesetzter_Zucker + "g Zucker"
        document.getElementById("Ballaststoffe").innerText = aktuelle_Ballaststoffe + "g Ballaststoffe"
}

function Werte_Rezept_ausgeben_Beschreibung(){//die definierten JS Variablen werden einfach in eine Variable in HTML gepackt
    document.getElementById("Rezept_Name").innerText = aktueller_Rezept_Name
    document.getElementById("Anleitung").innerText = aktuelle_Anleitung
    document.getElementById("Essgewohnheit").innerText = aktuelle_Essgewohnheit
}

function Werte_Rezept_ausgeben_Zeit(){//die definierten JS Variablen werden einfach in eine Variable in HTML gepackt
    if (Arbeitszeit_h === 0) { //falls halt unter 60min dann ohne Stunden, wenn mehr als 60min dann mit Stunden ausgeben
        document.getElementById("Arbeitszeit").innerText = Arbeitszeit_min + "min"
    } else {
        if (Arbeitszeit_min === 0) {//wenn dann aber genau eine oder 2 Stunden und keine Minuten bleiben übrig soll er die auch nicht mit ausgeben
            document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h"
        } else {
            document.getElementById("Arbeitszeit").innerText = Arbeitszeit_h + "h " + Arbeitszeit_min + "min"
        }
    }
    if (Kochzeit_h === 0) {//falls halt unter 60min dann ohne Stunden, wenn mehr als 60min dann mit Stunden ausgeben
        document.getElementById("Kochzeit").innerText = Kochzeit_min + "min"
    } else {
        if (Kochzeit_min === 0) {//wenn dann aber genau eine oder 2 Stunden und keine Minuten bleiben übrig soll er die auch nicht mit ausgeben
            document.getElementById("Kochzeit").innerText = Kochzeit_h + "h"
        } else {
            document.getElementById("Kochzeit").innerText = Kochzeit_h + "h " + Kochzeit_min + "min"
        }
    }
    if (Gesamtzeit_h === 0) {//falls halt unter 60min dann ohne Stunden, wenn mehr als 60min dann mit Stunden ausgeben
        document.getElementById("Gesamtzeit").innerText = Gesamtzeit_min + "min"
    } else {
        if (Gesamtzeit_min === 0) {//wenn dann aber genau eine oder 2 Stunden und keine Minuten bleiben übrig soll er die auch nicht mit ausgeben
            document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h"
        } else {
            document.getElementById("Gesamtzeit").innerText = Gesamtzeit_h + "h " + Gesamtzeit_min + "min"
        }
    }
}

function Zutaten_ausgeben(){
    let zutatenText = ""
    if (portionen === 1){//entweder die mit einer Portion
        for (i = 0; i < mengenListe.length; i++){ //dabei geht die for-schleife jedes Objekt in der Liste durch
            if (mengenListe[i] === 0){ // Wenn die mengenListe 0 Anzeigt bedeutet das, dass diese Zutat keine Menge besitzt (Salz)
                zutatenText += zutatenListe[i] + "\n"//der \n macht einfach nur, das es in eine Neue Zeile in den String gesetzt wird
            }
            else { //andern Falls gibt es die Menge und Einheit aus und dann die Zutat, Falls keine Einheit wird einfach nur "" angefügt (also wie nichts)
                zutatenText += mengenListe[i] + einheitenListe[i] + " " + zutatenListe[i] + "\n" //der \n macht einfach nur, das es in eine Neue Zeile in den String gesetzt wird
            }
        }
        document.getElementById("Zutaten").innerText = zutatenText
    }
    else { //oder mit beliebiger Anzahl an Portionen, Aber sonst eins zu eins gleich von Funktion, nimmt nur andere Liste als Berechnung
        for (i = 0; i < mengenListe_plus_portionen.length; i++){
            if (mengenListe_plus_portionen[i] === 0){
                zutatenText += zutatenListe[i] + "\n"
            }
            else {
                zutatenText += mengenListe_plus_portionen[i] + einheitenListe[i] + " " + zutatenListe[i] + "\n"
            }
        }
        document.getElementById("Zutaten").innerText = zutatenText;
    }

}

function portionenRechner(Portionen){
    if(mengenListe.length === 0) { // überprüfen ob die Liste leer ist, falls ja brauch er ja die Funktion nicht ausführen und lässt nochmal die Liste definieren (ist sozusagen eine sicherheit)
        Zutaten_in_Listen_umwandeln()
    }
    mengenListe_plus_portionen = mengenListe.map(menge => menge * Portionen) //hier wird einfach nur die aktuelle mengenListe mal die eingegeben Portionen gerechnet und gespeichert
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
