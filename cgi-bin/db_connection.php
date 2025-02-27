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

// Daten aus Naehrwerte_pro_Portion
$naehrwerteAbfrage = $datenbank->prepare("SELECT * FROM Naehrwerte_pro_Portion");
$naehrwerteAbfrage->execute();
$naehrwerte = $naehrwerteAbfrage->fetchAll(PDO::FETCH_ASSOC);

// Daten aus Rezept
$rezeptAbfrage = $datenbank->prepare("SELECT * FROM Rezept");
$rezeptAbfrage->execute();
$rezepte = $rezeptAbfrage->fetchAll(PDO::FETCH_ASSOC);

// Daten aus Zutaten_Einheiten
$einheitenAbfrage = $datenbank->prepare("SELECT * FROM Zutaten_Einheiten");
$einheitenAbfrage->execute();
$einheiten = $einheitenAbfrage->fetchAll(PDO::FETCH_ASSOC);

// Daten aus Zutaten_pro_Portion
$zutatenAbfrage = $datenbank->prepare("SELECT * FROM Zutaten_pro_Portion");
$zutatenAbfrage->execute();
$zutaten = $zutatenAbfrage->fetchAll(PDO::FETCH_ASSOC);

// JSON-Antwort senden
header('Content-Type: application/json');
echo json_encode([
    'naehrwerte' => $naehrwerte,
    'rezepte' => $rezepte,
    'einheiten' => $einheiten,
    'zutaten' => $zutaten
]);
?>