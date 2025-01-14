<?php
$server = 'mysql:host=database-5016834764.webspace-host.com;dbname=dbs13597122';
$benutzername = 'dbu813693';
$passwort = 'v!9JBj4^JAcLFTvO';
//Verbindung zur Datenbank wird hergestellt
try {
$datenbank = new PDO($server, $benutzername, $passwort);
// Falls er sich nicht verbinden kann wird das ausgegeben. Muss vorhanden sein (fängt die try "Schleife" ab)
} catch (PDOException $e) {
die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}
// dort wird die Variable "$erg" mit einer Datenbankabfrage beschrieben
$abfrage_Kohlenhydrate = $datenbank->prepare("SELECT * FROM Naehrwerte_pro_Portion");
$abfrage_Kohlenhydrate->execute();
$ergebnis_kohlenhydrate = $abfrage_Kohlenhydrate->fetchAll(PDO:: FETCH_ASSOC); #(falls nur nummern dann fetch_num)
// JSON-Antwort senden
header('Content-Type: application/json');
echo json_encode($ergebnis_kohlenhydrate);

#// Ausgabe des Wertes
#foreach($ergebnis_kohlenhydrate as $zeile) {
#    echo $zeile["Kohlenhydrate"] . "<br>";
#}
?>