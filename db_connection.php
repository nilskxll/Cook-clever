<?php
$dsn = 'mysql:host=database-5016834764.webspace-host.com;dbname=dbs13597122';
$benutzername = 'dbu813693';
$passwort = 'v!9JBj4^JAcLFTvO';

try {
$dbh = new PDO($dsn, $benutzername, $passwort);
// dort wird die Variable "$erg" mit einer Datenbankabfrage beschrieben
$erg = $dbh->prepare("SELECT Kohlenhydrate FROM Naehrwerte_pro_Portion WHERE Rezept_ID = :id");
// Die id (welches Rezept ausgewählt wird) wird hier in den wert :id geschrieben.
$erg->bindParam(':id', $rezeptId, PDO::PARAM_INT);

// Rezept ID nach Wahl festlegen
$rezeptId = 3;

$erg->execute();
$result = $erg->fetch(PDO::FETCH_ASSOC);

// Ausgabe des Wertes
if ($result) {
    echo $result['Kohlenhydrate'] ;
    echo "g Kohlenhydrate";
} else {
        echo "Kein Ergebnis gefunden.";
}
// Falls er sich nicht verbinden kann wird das ausgegeben. Muss vorhanden sein
} catch (PDOException $e) {
die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}
?>