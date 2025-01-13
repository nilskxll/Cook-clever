<?php
$dsn = 'mysql:host=database-5016834764.webspace-host.com;dbname=dbs13597122';
$benutzername = 'dbu813693';
$passwort = 'v!9JBj4^JAcLFTvO';

try {
$dbh = new PDO($dsn, $benutzername, $passwort);
echo "Verbindung zur Datenbank hergestellt.";
$erg = $dbh->query("SELECT Arbeitszeit FROM Rezept");
$rezepte = $erg->fetchAll(PDO::FETCH_ASSOC);

#    print_r($rezepte);
#if ($erg->num_rows) {
#    echo "<p>Daten vorhanden: Anzahl ";
#    echo $erg->num_rows;
#}

} catch (PDOException $e) {
die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}
?>